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
import { isActionOf }   from 'typesafe-actions'
import {
  filter,
  mergeMap,
  groupBy,
}                       from 'rxjs/operators'
import {
  Observable,
  merge,
  of,
}                       from 'rxjs'
import type { Epic }         from 'redux-observable'

import {
  Duck as WechatyDuck,
}                       from 'wechaty-redux'

import {
  milliAroundSeconds,
}                       from '../../utils.js'

import {
  takeUntilLoginout,
}                       from '../operators/mod.js'

const DING_WAIT_MILLISECONDS  = () => milliAroundSeconds(300) // 5 minutes
const RESET_WAIT_MILLISECONDS = () => milliAroundSeconds(600) // 10 minutes

const wechatyMessageFilter$ = (action$: ReturnType<Epic>, wechatyId: string) => action$.pipe(
  filter(isActionOf(WechatyDuck.actions.messageEvent)),
  filter(WechatyDuck.utils.isWechaty(wechatyId)),

  /**
   * use mergeMap:
   *  `message.self()` need to perform async task
   */
  mergeMap(WechatyDuck.utils.skipSelfMessage$),

  takeUntilLoginout(wechatyId, action$),
)

/**
 * High Available Stream Entrance
 *  emit all messages that come from the logged in wechaty(s)
 *
 *  In:  RootAction
 *  Out: WechatyDuck.actions.messageEvent groupBy wechatyId
 */
const wechatyMessage$$ = (action$: ReturnType<Epic>) => action$.pipe(
  filter(isActionOf(WechatyDuck.actions.loginEvent)),
  /**
   * mergeMap instead of switchMap:
   *  there might be multiple Wechaty instance passed to here
   */
  mergeMap(action => merge(
    of(action),
    wechatyMessageFilter$(action$, action.payload.wechatyId),
  )),
  groupBy(action => action.payload.wechatyId),
)

// https://itnext.io/typescript-extract-unpack-a-type-from-a-generic-baca7af14e51
type Extract<P> = P extends Observable<infer T> ? T : never;
export type GroupedMessageByWechaty = Extract<ReturnType<typeof wechatyMessage$$>>

export {
  DING_WAIT_MILLISECONDS,
  RESET_WAIT_MILLISECONDS,
  wechatyMessage$$,
}
