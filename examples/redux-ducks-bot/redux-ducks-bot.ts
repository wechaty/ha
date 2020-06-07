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
  Wechaty,
}             from 'wechaty'
import {
  PuppetMock,
  Mocker,
}                   from 'wechaty-puppet-mock'
import {
  QRCodeTerminal,
  EventLogger,
  DingDong,
}                   from 'wechaty-plugin-contrib'

import {
  createStore,
}                               from 'redux'
import { composeWithDevTools }  from 'remote-redux-devtools'
import {
  Ducks,
}                               from 'ducks'
import { Duck as WechatyDuck }  from 'wechaty-redux'
import { Counter as CounterDuck } from 'wechaty-ducks-contrib'

import {
  HAWechaty,
  Duck as HaDuck,
}                             from '../../src/'

import { HaEnvironment } from './ha-environment'
// import { CHATIE_OA_ID } from '../../src/config'

const ducks = new Ducks({
  counter : CounterDuck,
  ha      : HaDuck,
  wechaty : WechatyDuck,
})

const compose = composeWithDevTools({
  hostname : 'localhost',
  maxAge   : 500,
  port     : 8000,
  realtime : true,
})

const ducksEnhancer = ducks.enhancer()

const store = createStore(
  state => state,
  compose(
    ducksEnhancer,
  ) as typeof ducksEnhancer,
)
void store

const mocker1 = new Mocker()
const mocker2 = new Mocker()

mocker1.use(HaEnvironment())
mocker2.use(HaEnvironment())

const puppet1 = new PuppetMock({ mocker: mocker1 })
const puppet2 = new PuppetMock({ mocker: mocker2 })

const wechaty1 = new Wechaty({ name: 'wechaty1', puppet: puppet1 })
const wechaty2 = new Wechaty({ name: 'wechaty2', puppet: puppet2 })

const haWechaty = new HAWechaty({
  ducks,
  name: 'ha-wechaty',
})

haWechaty.add(wechaty1, wechaty2)
// haWechaty.del(wechaty2, wechaty1)

console.info('nodes: ', haWechaty.nodes().length)

haWechaty.use(
  EventLogger(),
  QRCodeTerminal(),
  DingDong({ self: false }),
)

// haWechaty.once('login', () => setInterval(
//   async () => {
//     const filehelper = await haWechaty.Contact.load(CHATIE_OA_ID)
//     if (filehelper) {
//       await filehelper.say('ding')
//     } else {
//       console.error('filehelper not found')
//     }
//   },
//   5 * 1000,
// ))

haWechaty.start()
  .catch(console.error)
