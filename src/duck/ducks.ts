import type {
  Bundle,
  Ducks,
}           from 'ducks'

import * as haDuck from './mod.js'

let instance: undefined | Ducks<any>
const getBundle = () => {
  if (instance) {
    return instance.ducksify(haDuck) as Bundle<typeof haDuck>
  }
  throw new Error('NO INSTANCE')
}

function setDucks (ducks: Ducks<any>): void {
  if (instance) {
    throw new Error('ducks has already been set before. can not set twice.')
  }
  instance = ducks
}

// function getDucks (): Ducks<any> {
//   if (!instance) {
//     throw new Error('no ducks set yet.')
//   }
//   return instance
// }

export {
  // getDucks,
  getBundle,
  setDucks,
}
