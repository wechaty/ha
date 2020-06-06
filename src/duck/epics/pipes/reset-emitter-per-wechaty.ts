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
  Observable,
}                 from 'rxjs'
import {
  debounce,
  mapTo,
  switchMap,
}                   from 'rxjs/operators'

import { Epic }     from 'redux-observable'

import {
  Duck as WechatyDuck,
}                       from 'wechaty-redux'

import * as HaDuck      from '../../'

import {
  takeUntilDong,
  takeUntilLoginout,
}                     from '../operators/'

import { wechatyMessage$$ } from './wechaty-message'

const RESET_WAIT_MILLISECONDS = HaDuck.utils.milliAroundSeconds(300)

// https://itnext.io/typescript-extract-unpack-a-type-from-a-generic-baca7af14e51
type Extract<P> = P extends Observable<infer T> ? T : never;
type GroupedMessageByWechaty = Extract<ReturnType<typeof wechatyMessage$$>>

/**
 * In:  wechatyMessage$
 * Out:
 *  WechatyDuck.actions.reset
 */
const resetEmitterPerWechaty$ = (
  action$         : ReturnType<Epic>,
  wechatyMessage$ : GroupedMessageByWechaty,
) => wechatyMessage$.pipe(
  debounce(() => interval(RESET_WAIT_MILLISECONDS)),
  switchMap(action => interval(RESET_WAIT_MILLISECONDS).pipe(
    mapTo(WechatyDuck.actions.reset(
      action.payload.wechatyId,
      'ha-wechaty/duck/epics.ts/resetEmitterEpicPerWechaty$(action)',
    )),
    takeUntilDong(action.payload.wechatyId, action$),
    takeUntilLoginout(action.payload.wechatyId, action$),
  )),
)

export { resetEmitterPerWechaty$ }
