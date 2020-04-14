/**
 * Increase or Decrease a random time on the target seconds
 * based on the `factor`
 * @param seconds base number of target seconds
 */
export const aroundSeconds = (seconds: number) => {
  const factor = 1 / 7
  const ms = seconds * 1000

  const base = ms * (1 - factor)
  const vari = ms * factor * 2 * Math.random()

  const finalTime = base + Math.round(vari)
  return finalTime
}
