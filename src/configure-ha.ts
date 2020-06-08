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
  compose,
}                from 'redux'
import { RemoteReduxDevToolsOptions } from 'remote-redux-devtools'

import { Ducks }                      from 'ducks'
import { Duck as WechatyDuck }        from 'wechaty-redux'
import {
  log,
  MemoryCard,
  Wechaty,
}                     from 'wechaty'

import * as HaDuck    from './duck/'
import { HAWechaty }  from './ha-wechaty'
import { envWechaty } from './env-wechaty'
import { DucksMapObject } from 'ducks/dist/src/duck'

let initialized = false

type DefaultDuckery = {
  ha      : typeof HaDuck
  wechaty : typeof WechatyDuck
}

interface ConfigureHaOptions<T extends DucksMapObject> {
  name?   : string,
  memory? : MemoryCard,

  ducks?: Ducks<T>,

  reduxDevTools?              : boolean | 'remote',
  remoteReduxDevToolsOptions? : RemoteReduxDevToolsOptions
}

function configureHa <T extends DucksMapObject = DefaultDuckery> (
  options: ConfigureHaOptions<T> = {},
): HAWechaty<T> {
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

  if (!options.ducks) {
    options.ducks = new Ducks({
      ha      : HaDuck,
      wechaty : WechatyDuck,
    }) as any as Ducks<any>
  } else {
    const haBundle      = options.ducks.ducksify(HaDuck as any)
    const wechatyBundle = options.ducks.ducksify(WechatyDuck as any)
    if (!haBundle || !wechatyBundle) {
      throw new Error('Ducks must at least contains HaDuck and WechatyDuck!')
    }
  }

  let devCompose = compose

  if (options.reduxDevTools) {
    if (options.reduxDevTools === 'remote') {
      if (!options.remoteReduxDevToolsOptions) {
        throw new Error('redux remote dev tools need options.')
      }

      try {
        const composeWithDevTools = require('remote-redux-devtools').composeWithDevTools
        devCompose = composeWithDevTools(options)
      } catch (e) {
        log.error('HAWechaty', 'configureHa() require(remote-redux-devtools) rejection: %s', e)
        console.error(e)
      }

    } else {
      // return configureDevtools()
      throw new Error('TODO: redux devtools')
    }
  }

  const ducksEnhancer = options.ducks.enhancer()

  createStore(
    state => state,
    devCompose(
      ducksEnhancer,
    ),
  )

  const haWechaty = new HAWechaty({
    ducks  : options.ducks,
    memory : options.memory,
    name   : options.name,
  })

  const wechatyOptionsList = envWechaty(
    process.env as any,
    options.name,
    options.memory,
  )

  const wechatyList = wechatyOptionsList.map(opt => new Wechaty(opt))

  haWechaty.add(
    ...wechatyList
  )

  return haWechaty
}

export {
  configureHa,
}
