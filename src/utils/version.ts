// Minimum HA version that supports type: 'expandable' in ha-form schemas.
// PR home-assistant/frontend#14197, shipped in HA 2022.11.0.
export const MIN_VERSION_EXPANDABLE: [number, number, number] = [2022, 11, 0];

// Returns true if the given HA version string meets or exceeds the minimum.
// Version strings follow the format "YYYY.M.P" (e.g. "2026.5.2"). Prerelease
// suffixes like "2024.11.0b0" or "2024.11.0dev0" are handled via parseInt.
// Returns false for undefined, empty, or unparseable version strings.
export function isVersionAtLeast(
  version: string | undefined,
  minimum: [number, number, number]
): boolean {
  if (!version) return false;
  const parts = version.split('.').map((p) => parseInt(p, 10));
  if (parts.length < 2 || parts.some((p) => !Number.isFinite(p) || p < 0)) return false;
  const [major, minor, patch = 0] = parts;
  const [minMajor, minMinor, minPatch] = minimum;
  if (major !== minMajor) return major > minMajor;
  if (minor !== minMinor) return minor > minMinor;
  return patch >= minPatch;
}
