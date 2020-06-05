/**
 *   Wechaty Open Source Software - https://github.com/wechaty
 *
 *   @copyright 2016 Huan LI (李卓桓) <https://github.com/huan>, and
 *                   Wechaty Contributors <https://github.com/wechaty>.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
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
