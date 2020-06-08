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
import { createStore }                from 'redux'
import { RemoteReduxDevToolsOptions } from 'remote-redux-devtools'

import { Ducks }                      from 'ducks'
import { Duck as WechatyDuck }        from 'wechaty-redux'
import {
  log,
  MemoryCard,
  Wechaty,
}                     from 'wechaty'

import * as HaDuck from './duck/'

import {
  HAWechaty,
}                     from './ha-wechaty'
import { envWechaty } from './env-wechaty'

let initialized = false

interface ConfigureHaOptions {
  name?   : string,
  memory? : MemoryCard,

  reduxDevTools?              : boolean | 'remote',
  remoteReduxDevToolsOptions? : RemoteReduxDevToolsOptions
}

function configureHa (
  options: ConfigureHaOptions = {},
): HAWechaty {
  log.verbose('HAWechaty', 'configureHa(%s)', JSON.stringify(options))

  if (initialized) {
    throw new Error('configureHa() can not be called twice: it has already been called before.')
  }
  initialized = true

  if (!options.name) {
    options.name = 'ha-wechaty'
  }

  if (!options.memory) {
    options.memory = new MemoryCard(options.name)
  }

  let ha: HAWechaty

  if (options.reduxDevTools) {
    if (options.reduxDevTools === 'remote') {
      if (!options.remoteReduxDevToolsOptions) {
        throw new Error('redux remote dev tools need options.')
      }
      ha = configureHaWithRemoteDevTools(
        options.name!,
        options.memory!,
        options.remoteReduxDevToolsOptions,
      )
    } else {
      // return configureDevtools()
      throw new Error('TODO: redux devtools')
    }
  } else {
    ha =  configureHaWithDucks(
      options.name!,
      options.memory!,
    )
  }

  const wechatyOptionsList = envWechaty(
    process.env as any,
    options.name,
    options.memory,
  )

  const wechatyList = wechatyOptionsList.map(opt => new Wechaty(opt))

  ha.add(
    ...wechatyList
  )

  return ha
}

function configureHaWithRemoteDevTools (
  name: string,
  memory: MemoryCard,
  options: RemoteReduxDevToolsOptions
) {
  log.verbose('HAWechaty', 'configureHaWithRemoteDevTools(%s, %s, %s)', name, memory, JSON.stringify(options))

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
    memory,
    name,
  })

  return haWechaty
}

// function configureDevtools () {
//   throw new Error('tod')
// }

function configureHaWithDucks (
  name: string,
  memory: MemoryCard,
) {
  log.verbose('HAWechaty', 'configureHaWithDucks(%s, %s)', name, memory)

  const ducks = new Ducks({
    ha      : HaDuck,
    wechaty : WechatyDuck,
  })

  ducks.configureStore()

  const ha = new HAWechaty({
    ducks,
    memory,
    name,
  })

  return ha
}

export {
  configureHa,
}
