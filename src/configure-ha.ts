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
import { Ducks }                      from 'ducks'
import { createStore }                from 'redux'
import { Duck as WechatyDuck }        from 'wechaty-redux'
import { RemoteReduxDevToolsOptions } from 'remote-redux-devtools'

import * as HaDuck from './duck/'

import { HAWechaty }  from './ha-wechaty'
import { envWechaty } from './env-wechaty'

let initialized = false

function configureHa ()                                                        : HAWechaty
function configureHa (devtools: true)                                          : HAWechaty
function configureHa (devtools: 'remote', options: RemoteReduxDevToolsOptions) : HAWechaty

function configureHa (
  devtools: boolean | 'remote' = false,
  options?: RemoteReduxDevToolsOptions,
): HAWechaty {
  if (initialized) {
    throw new Error('configureHa() can not be called twice: it has already been called before.')
  }
  initialized = true

  let ha: HAWechaty

  if (devtools) {
    if (devtools === 'remote') {
      if (!options) {
        throw new Error('redux remote dev tools need options.')
      }
      ha = configureRemoteDevTools(options)
    } else {
      // return configureDevtools()
      throw new Error('TODO: redux devtools')
    }
  } else {
    ha =  configureDucks()
  }

  const wechatyList = envWechaty({
    name: 'env-wechaty',
  })

  ha.add(
    ...wechatyList
  )

  return ha
}

function configureRemoteDevTools (options: RemoteReduxDevToolsOptions) {
  const composeWithDevTools = require('remote-redux-devtools').composeWithDevTools
  const compose = composeWithDevTools(options)

  const ducks = new Ducks({
    ha      : HaDuck,
    wechaty : WechatyDuck,
  })

  const ducksEnhancer = ducks.enhancer()

  createStore(
    state => state,
    compose(
      ducksEnhancer,
    ) as typeof ducksEnhancer,
  )

  const haWechaty = new HAWechaty({
    ducks,
    name: 'ha-wechaty',
  })

  return haWechaty
}

// function configureDevtools () {
//   throw new Error('tod')
// }

function configureDucks () {
  const ducks = new Ducks({
    ha      : HaDuck,
    wechaty : WechatyDuck,
  })

  ducks.configureStore()

  const name = 'ha-wechaty'

  const ha = new HAWechaty({
    ducks,
    name,
  })

  return ha
}

export {
  configureHa,
}
