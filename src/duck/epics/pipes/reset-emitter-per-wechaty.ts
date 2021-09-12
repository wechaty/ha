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
  merge,
  interval,
  of,
  timer,
}                 from 'rxjs'
import {
  debounce,
  mapTo,
  switchMap,
}                   from 'rxjs/operators'

import type { Epic }     from 'redux-observable'

import {
  Duck as WechatyDuck,
}                       from 'wechaty-redux'

import * as actions      from '../../actions.js'

import {
  takeUntilDong,
  takeUntilLoginout,
}                     from '../operators/mod.js'

import {
  GroupedMessageByWechaty,
  RESET_WAIT_MILLISECONDS,
}                           from './wechaty-message.js'

/**
 * In:  wechatyMessage$
 * Out:
 *  WechatyDuck.actions.reset
 */
const resetEmitterPerWechaty$ = (
  action$         : ReturnType<Epic>,
  wechatyMessage$ : GroupedMessageByWechaty,
) => wechatyMessage$.pipe(
  /**
   * Suppress the failure by processing the messages with debounce().
   *  Failure will be emitted if there's no message
   *  for more than RESET_WAIT_MILLISECONDS
   */
  debounce(() => interval(RESET_WAIT_MILLISECONDS())),

  switchMap(action => merge(
    /**
     * Fail the Wechaty first
     */
    of(actions.failureWechaty(action.payload.wechatyId)),

    timer(0, RESET_WAIT_MILLISECONDS()).pipe(
      mapTo(WechatyDuck.actions.reset(
        action.payload.wechatyId,
        'ha-wechaty dong timeout for ' + action.payload.wechatyId,
      )),
      takeUntilDong(action.payload.wechatyId, action$),
      takeUntilLoginout(action.payload.wechatyId, action$),
    )
  )),
)

export { resetEmitterPerWechaty$ }
