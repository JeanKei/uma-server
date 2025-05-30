export function parseMetricToNumber(
  input: string | null | undefined
): number | null {
  if (!input) return null;

  const trimmed = input.trim().toUpperCase();

  const multiplier = trimmed.endsWith("K")
    ? 1_000
    : trimmed.endsWith("M")
      ? 1_000_000
      : 1;

  const numericPart = trimmed.replace(/[KM]/, "");

  const parsed = parseFloat(numericPart);

  if (isNaN(parsed)) return null;

  return Math.round(parsed * multiplier);
}
