// Minimum HA version that supports type: 'expandable' in ha-form schemas.
// PR home-assistant/frontend#14197, shipped in HA 2022.11.0.
export const MIN_VERSION_EXPANDABLE: [number, number, number] = [2022, 11, 0];

// Returns true if the given HA version string meets or exceeds the minimum.
// Version strings follow HA's "YYYY.M.P" format (e.g. "2026.5.2").
// Major and minor segments must be pure digits. The patch segment allows
// trailing suffixes for HA prerelease formats ("2024.11.0b0", "2024.11.0dev0").
// Extra dot-separated segments are ignored ("2026.6.0.dev202605170318").
// Returns false for undefined, empty, or unparseable version strings.
export function isVersionAtLeast(
  version: string | undefined,
  minimum: [number, number, number]
): boolean {
  if (!version) return false;
  const segments = version.split('.');
  if (segments.length < 2) return false;
  if (!/^\d+$/.test(segments[0]) || !/^\d+$/.test(segments[1])) return false;
  const major = Number(segments[0]);
  const minor = Number(segments[1]);
  let patch = 0;
  if (segments.length >= 3) {
    patch = parseInt(segments[2], 10);
    if (!Number.isFinite(patch) || patch < 0) return false;
  }
  const [minMajor, minMinor, minPatch] = minimum;
  if (major !== minMajor) return major > minMajor;
  if (minor !== minMinor) return minor > minMinor;
  return patch >= minPatch;
}
