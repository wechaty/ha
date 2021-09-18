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
  from,
  of,
}                 from 'rxjs'
import {
  catchError,
  ignoreElements,
  filter,
  mergeMap,
}                   from 'rxjs/operators'
import type { Epic }     from 'redux-observable'
import {
  getWechaty,
  Duck as WechatyDuck,
}                       from 'wechaty-redux'

import * as actions from '../actions.js'

const DING = 'ding'

const ding$ = (action: ReturnType<typeof actions.dingHa>) => from(
  getWechaty(action.payload.wechatyId)
    .Contact.load(action.payload.contactId)
    .say(DING)
).pipe(
  ignoreElements(),
  catchError(e => of(
    WechatyDuck.actions.errorEvent(
      action.payload.wechatyId,
      { ...e },
    )
  )),
)

/**
 * In:  actions.ding
 * Out: void
 *
 * Side Effect: call contact.say(ding)
 */
const dingEpic: Epic = (action$) => action$.pipe(
  filter(isActionOf(actions.dingHa)),
  mergeMap(ding$),
)

export {
  dingEpic,
}
