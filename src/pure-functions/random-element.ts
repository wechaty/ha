/**
 * Credit: https://stackoverflow.com/a/5915122/1123955
 */
const randomElement = <T> (items: ArrayLike<T>) => items[
  Math.floor(
    Math.random() * items.length,
  )
]

export { randomElement }
