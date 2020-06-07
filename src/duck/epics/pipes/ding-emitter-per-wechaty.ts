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
  interval,
  merge,
  timer,
}                 from 'rxjs'
import {
  debounce,
  mapTo,
  switchMap,
}                   from 'rxjs/operators'

import { Epic }     from 'redux-observable'

import {
  CHATIE_OA_ID,
}                       from '../../../config'

import {
  dingHa,
}                       from '../../actions'

import {
  takeUntilDong,
  takeUntilLoginout,
}                     from '../operators/'

import {
  GroupedMessageByWechaty,
  DING_WAIT_MILLISECONDS,
}                             from './wechaty-message'

/**
 * In:  wechatyMessage
 * Out:
 *  actions.failureWechaty
 *  actions.ding
 */
const dingEmitterPerWechaty$ = (
  action$         : ReturnType<Epic>,
  wechatyMessage$ : GroupedMessageByWechaty,
) => wechatyMessage$.pipe(
  /**
   * Suppress the ding testing by processing the messages with debounce().
   *  Ding testing will be emitted if there's no message
   *  for more than DING_WAIT_MILLISECONDS
   */
  debounce(() => interval(DING_WAIT_MILLISECONDS)),
  switchMap(action => merge(
    // of(failureWechaty(action.payload.wechatyId)),
    timer(0, Math.floor(DING_WAIT_MILLISECONDS / 3)).pipe(
      mapTo(dingHa(
        action.payload.wechatyId,
        CHATIE_OA_ID,
      )),
      takeUntilDong(action.payload.wechatyId, action$),
      takeUntilLoginout(action.payload.wechatyId, action$),
    )
  )),
)

export { dingEmitterPerWechaty$ }
