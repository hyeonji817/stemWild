export function sexagenary(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12),
    yy = y + 4800 - a,
    mm = m + 12 * a - 3;
  const j =
    d +
    Math.floor((153 * mm + 2) / 5) +
    365 * yy +
    Math.floor(yy / 4) -
    Math.floor(yy / 100) +
    Math.floor(yy / 400) -
    32045;
  return (((j + 49) % 60) + 60) % 60;
}
