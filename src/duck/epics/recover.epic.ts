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
import { isActionOf } from 'typesafe-actions'
import {
  merge,
}                     from 'rxjs'
import {
  mergeMap,
  filter,
}                     from 'rxjs/operators'
import type { Epic }       from 'redux-observable'

import { Duck as WechatyDuck } from 'wechaty-redux'

import * as actions   from '../actions.js'

import {
  recoverWechaty$,
  recoverHa$,
}                     from './pipes/mod.js'

/**
 * In: actions.dongHA
 * Out:
 *  actions.recoverWechaty
 *  actions.recoverHa
 */
const recoverEpic: Epic = action$ => action$.pipe(
  filter(isActionOf([
    actions.dongHa,
    WechatyDuck.actions.loginEvent,
  ])),
  mergeMap(action => merge(
    recoverWechaty$(action),
    recoverHa$(action),
  )),
)

export { recoverEpic }
