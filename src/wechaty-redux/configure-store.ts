import {
  Store,
  createStore,
}               from 'redux'
import {
  Duck,
  Ducks,
  noopReducer,
}               from 'ducks'

import * as api from './api/'

let store: Store

function configureStore () {
  if (store) {
    return store
  }

  const wechatyDuck = new Duck(api)
  const ducks = new Ducks({
    wechaty: wechatyDuck,
  })
  const ducksEnhancer = ducks.enhancer()

  store = createStore(
    noopReducer,
    ducksEnhancer,
  )

  return store
}

export {
  configureStore,
}
