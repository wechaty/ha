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
  isActionOf,
}                 from 'typesafe-actions'
import {
  filter,
  map,
  mergeMap,
  groupBy,
}                   from 'rxjs/operators'

import { Epic }     from 'redux-observable'

import {
  Duck as WechatyDuck,
}                       from 'wechaty-redux'

import {
  takeUntilLoginout,
}                     from '../operators/'

/**
 * High Available Stream Entrance
 *  emit all messages that come from the logged in wechaty(s)
 *
 * In:  RootAction
 * Out: WechatyDuck.actions.messageEvent groupBy wechatyId
 */
const wechatyMessage$$ = (action$: ReturnType<Epic>) => action$.pipe(
  filter(isActionOf(WechatyDuck.actions.loginEvent)),
  map(action => action.payload.wechatyId),
  /**
   * mergeMap instead of switchMap:
   *  there might be multiple Wechaty instance passed to here
   */
  mergeMap(wechatyId => action$.pipe(
    filter(isActionOf(WechatyDuck.actions.messageEvent)),
    filter(WechatyDuck.utils.isWechaty(wechatyId)),
    mergeMap(WechatyDuck.utils.skipSelfMessage$),
    takeUntilLoginout(wechatyId, action$),
  )),
  groupBy(action => action.payload.wechatyId),
)

export { wechatyMessage$$ }
