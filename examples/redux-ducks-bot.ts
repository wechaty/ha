import {
  createStore,
}                               from 'redux'
import { composeWithDevTools }  from 'remote-redux-devtools'
import {
  Ducks,
  noopReducer,
}                               from 'ducks'

import { Wechaty } from 'wechaty'

import {
  HAWechaty,
  api as haApi,
}                             from '../src'
import { api as wechatyApi }  from '../src/wechaty-redux'

import * as counterApi        from '../src/wechaty-ducks-counter'

const ducks = new Ducks({
  counter : counterApi,
  ha      : haApi,
  wechaty : wechatyApi,
})

const compose = composeWithDevTools({
  hostname : 'localhost',
  port     : 8000,
  realtime : true,
})

const ducksEnhancer = ducks.enhancer()

const store = createStore(
  noopReducer,
  compose(
    ducksEnhancer,
  ) as typeof ducksEnhancer,
)
void store

const haWechaty = new HAWechaty({
  ducks,
  name: 'ha-wechaty',
})

const options = { puppet: 'wechaty-puppet-mock' as const }
const wechaty1 = new Wechaty({ name: 'wechaty1', ...options })
const wechaty2 = new Wechaty({ name: 'wechaty2', ...options })

haWechaty.add(wechaty1, wechaty2)

// haWechaty.remove(wechaty2, wechaty1)

console.info('nodes: ', haWechaty.nodes().length)

haWechaty.start()
  .catch(console.error)
