import {
  Bundle,
  Ducks,
}           from 'ducks'

import * as haDuck from './mod'

let instance: Ducks<any>
const getBundle = () => instance.ducksify(haDuck) as Bundle<typeof haDuck>

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
