import { noChange } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive, PartType, type ElementPart, type PartInfo } from 'lit/directive.js';
import { fireEvent } from '../ha/types.js';

export interface ActionHandlerOptions {
  hasHold?: boolean;
  hasDoubleClick?: boolean;
  isTapUrl?: boolean;
}

class ActionHandlerDirective extends AsyncDirective {
  private _element?: HTMLElement;
  private _options: ActionHandlerOptions = {};

  private _pendingTap = false;
  private _isSecondTap = false;
  private _heldFired = false;
  private _canceled = false;
  private _activePointerId: number | null = null;
  private _startX = 0;
  private _startY = 0;
  private _lastPointerUpMs = 0;

  private _holdTimer?: ReturnType<typeof setTimeout>;
  private _doubleTapTimer?: ReturnType<typeof setTimeout>;

  constructor(partInfo: PartInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error('actionHandler must be applied to an element');
    }
  }

  render(_options?: ActionHandlerOptions): typeof noChange {
    void _options;
    return noChange;
  }

  update(part: ElementPart, [options]: [ActionHandlerOptions]): typeof noChange {
    this._options = options ?? {};
    const el = part.element as HTMLElement;
    if (this._element !== el) {
      if (this._element) this._removeListeners(this._element);
      this._element = el;
      this._bindListeners(this._element);
    }
    return noChange;
  }

  private _bindListeners(el: HTMLElement): void {
    el.addEventListener('pointerdown', this._onPointerDown);
    el.addEventListener('pointerup', this._onPointerUp);
    el.addEventListener('pointermove', this._onPointerMove);
    el.addEventListener('pointercancel', this._onPointerCancel);
    el.addEventListener('lostpointercapture', this._onLostPointerCapture);
    el.addEventListener('click', this._onClick);
    el.addEventListener('contextmenu', this._onContextMenu, { passive: false });
    el.addEventListener('keydown', this._onKeyDown, { passive: false });
    el.addEventListener('keyup', this._onKeyUp, { passive: false });
    el.addEventListener('blur', this._onBlur);
  }

  private _removeListeners(el: HTMLElement): void {
    el.removeEventListener('pointerdown', this._onPointerDown);
    el.removeEventListener('pointerup', this._onPointerUp);
    el.removeEventListener('pointermove', this._onPointerMove);
    el.removeEventListener('pointercancel', this._onPointerCancel);
    el.removeEventListener('lostpointercapture', this._onLostPointerCapture);
    el.removeEventListener('click', this._onClick);
    el.removeEventListener('contextmenu', this._onContextMenu);
    el.removeEventListener('keydown', this._onKeyDown);
    el.removeEventListener('keyup', this._onKeyUp);
    el.removeEventListener('blur', this._onBlur);
  }

  private _resetState(): void {
    this._pendingTap = false;
    this._isSecondTap = false;
    this._heldFired = false;
    this._canceled = false;
    this._activePointerId = null;
    clearTimeout(this._holdTimer);
    clearTimeout(this._doubleTapTimer);
    this._holdTimer = undefined;
    this._doubleTapTimer = undefined;
  }

  private _fireAction(actionType: 'tap' | 'hold' | 'double_tap'): void {
    if (this._element) {
      fireEvent(this._element, 'action', { action: actionType });
    }
  }

  private _onPointerDown = (ev: PointerEvent): void => {
    if (!ev.isPrimary || ev.button !== 0) return;
    if (this._activePointerId !== null) return;

    this._element!.setPointerCapture(ev.pointerId);

    if (this._pendingTap) {
      clearTimeout(this._doubleTapTimer);
      this._doubleTapTimer = undefined;
      this._isSecondTap = true;
      this._pendingTap = false;
    }

    this._activePointerId = ev.pointerId;
    this._startX = ev.clientX;
    this._startY = ev.clientY;
    this._heldFired = false;
    this._canceled = false;

    if (this._options.hasHold) {
      this._holdTimer = setTimeout(() => {
        this._heldFired = true;
        window.dispatchEvent(new CustomEvent('haptic', { detail: 'medium' }));
      }, 500);
    }
  };

  private _onPointerUp = (ev: PointerEvent): void => {
    if (ev.pointerId !== this._activePointerId) return;

    clearTimeout(this._holdTimer);
    this._holdTimer = undefined;

    // Clear before releasePointerCapture so lostpointercapture sees null and ignores it
    this._activePointerId = null;
    this._lastPointerUpMs = Date.now();
    this._element!.releasePointerCapture(ev.pointerId);

    if (this._canceled) {
      this._resetState();
      return;
    }

    if (this._heldFired) {
      this._fireAction('hold');
      this._resetState();
      return;
    }

    if (this._isSecondTap) {
      this._fireAction('double_tap');
      this._resetState();
      return;
    }

    // Skip 250ms delay for URL tap to preserve user activation for window.open
    if (this._options.hasDoubleClick && this._options.isTapUrl) {
      this._fireAction('tap');
      this._resetState();
      return;
    }

    if (this._options.hasDoubleClick) {
      this._pendingTap = true;
      this._doubleTapTimer = setTimeout(() => {
        if (this._pendingTap) {
          this._pendingTap = false;
          this._fireAction('tap');
          this._resetState();
        }
      }, 250);
    } else {
      this._fireAction('tap');
      this._resetState();
    }
  };

  private _onPointerMove = (ev: PointerEvent): void => {
    if (ev.pointerId !== this._activePointerId) return;
    const dx = ev.clientX - this._startX;
    const dy = ev.clientY - this._startY;
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
      this._canceled = true;
      clearTimeout(this._holdTimer);
      this._holdTimer = undefined;
    }
  };

  private _onPointerCancel = (ev: PointerEvent): void => {
    if (ev.pointerId !== this._activePointerId) return;
    this._canceled = true;
    clearTimeout(this._holdTimer);
    this._holdTimer = undefined;
    this._element!.releasePointerCapture(ev.pointerId);
    this._activePointerId = null;
    this._resetState();
  };

  private _onLostPointerCapture = (): void => {
    // Only cancel if still tracking - normal release clears _activePointerId first
    if (this._activePointerId !== null) {
      this._canceled = true;
      clearTimeout(this._holdTimer);
      this._holdTimer = undefined;
      this._activePointerId = null;
    }
  };

  // Fallback for AT (screen readers synthesize click without pointer events)
  private _onClick = (): void => {
    if (Date.now() - this._lastPointerUpMs < 300) return; // suppress click following pointer events
    this._fireAction('tap');
  };

  private _onContextMenu = (ev: MouseEvent): void => {
    if (this._options.hasHold) {
      ev.preventDefault();
    }
  };

  private _onKeyDown = (ev: KeyboardEvent): void => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      if (ev.repeat) return;
      this._heldFired = false;
      this._canceled = false;
      if (this._options.hasHold) {
        this._holdTimer = setTimeout(() => {
          this._heldFired = true;
          window.dispatchEvent(new CustomEvent('haptic', { detail: 'medium' }));
        }, 500);
      }
    } else if (ev.key === ' ') {
      ev.preventDefault();
      this._canceled = false;
    }
  };

  private _onKeyUp = (ev: KeyboardEvent): void => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      clearTimeout(this._holdTimer);
      this._holdTimer = undefined;
      if (this._canceled) {
        this._resetState();
        return;
      }
      if (this._heldFired) {
        this._fireAction('hold');
        this._resetState();
        return;
      }
      this._fireAction('tap');
      this._resetState();
    } else if (ev.key === ' ') {
      if (!this._canceled) {
        this._fireAction('tap');
      }
    }
  };

  private _onBlur = (): void => {
    // Only cancel if there is an active gesture - prevents stale _canceled state
    if (this._holdTimer !== undefined || this._activePointerId !== null) {
      this._canceled = true;
      clearTimeout(this._holdTimer);
      this._holdTimer = undefined;
    }
  };

  disconnected(): void {
    if (this._element) this._removeListeners(this._element);
    this._resetState();
  }

  reconnected(): void {
    if (this._element) this._bindListeners(this._element);
  }
}

export const actionHandler = directive(ActionHandlerDirective);
