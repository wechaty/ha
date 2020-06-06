import { Ducks } from 'ducks'

import { Duck as wechatyDuck } from 'wechaty-redux'
import * as haDuck from './duck/'

import { HAWechaty } from '.'
import { envWechaty } from './env-wechaty'

let initialized = false

function configureHa () {
  if (initialized) {
    throw new Error('configureHa() can not be called twice: it has already been called before.')
  }
  initialized = true

  const ducks = new Ducks({
    ha      : haDuck,
    wechaty : wechatyDuck,
  })

  ducks.configureStore()

  const name = 'ha-wechaty'

  const ha = new HAWechaty({
    ducks,
    name,
  })

  const wechatyList = envWechaty({
    name: 'env-wechaty',
  })

  ha.add(
    ...wechatyList
  )

  return ha
}

export {
  configureHa,
}
