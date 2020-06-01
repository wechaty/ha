import { Ducks } from 'ducks'

import { api as wechatyApi } from './wechaty-redux'
import * as haApi from './api'

// import { configureDucks } from './configure-ducks'
import { HAWechaty } from '.'
import { envWechaty } from './env-wechaty'

let initialized = false

function configureHa () {
  if (initialized) {
    throw new Error('configureHa() can not be called twice: it has already been called before.')
  }
  initialized = true

  const ducks = new Ducks({
    ha      : haApi,
    wechaty : wechatyApi,
  })

  ducks.configureStore()

  const name = 'ha-wechaty'
  const duck = ducks.ducksify('ha')

  const ha = new HAWechaty({
    duck,
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
