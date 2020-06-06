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
  of,
  merge,
  Observable,
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
  milliAroundSeconds,
}                       from '../../utils'
import {
  failureWechaty,
  ding,
}                       from '../../actions'

import {
  takeUntilDong,
  takeUntilLoginout,
}                     from '../operators/'

import { wechatyMessage$$ } from './wechaty-message'

const DING_WAIT_MILLISECONDS  = milliAroundSeconds(60)

// https://itnext.io/typescript-extract-unpack-a-type-from-a-generic-baca7af14e51
type Extract<P> = P extends Observable<infer T> ? T : never;
type GroupedMessageByWechaty = Extract<ReturnType<typeof wechatyMessage$$>>

/**
 * In:  ha$
 * Out:
 *  actions.failureWechaty
 *  actions.ding
 */
const dingEmitterPerWechaty$ = (
  action$         : ReturnType<Epic>,
  wechatyMessage$ : GroupedMessageByWechaty,
) => wechatyMessage$.pipe(
  debounce(() => interval(DING_WAIT_MILLISECONDS)),
  switchMap(action => merge(
    of(failureWechaty(action.payload.wechatyId)),
    interval(DING_WAIT_MILLISECONDS).pipe(
      mapTo(ding(
        action.payload.wechatyId,
        CHATIE_OA_ID,
      )),
      takeUntilDong(action.payload.wechatyId, action$),
      takeUntilLoginout(action.payload.wechatyId, action$),
    )
  )),
)

export { dingEmitterPerWechaty$ }
