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
  of,
  empty,
}                 from 'rxjs'
import {
  mergeMap,
  filter,
}                   from 'rxjs/operators'

import { Epic }     from 'redux-observable'

import { getBundle } from '../ducks'

import * as actions from '../actions'

/**
 * In: actions.recoverWechaty
 * Out:
 *  actions.recoverHA
 */
const recoverHaEmitterEpic: Epic = (action$, _state$) => action$.pipe(
  filter(isActionOf(actions.recoverWechaty)),
  mergeMap(action => {
    const available = getBundle().selectors.isWechatyAvailable(action.payload.wechatyId)
    if (available) {
      return empty()
    }
    const haId = getBundle().selectors.getHaByWechaty(action.payload.wechatyId)
    return of(actions.recoverHa(haId))
  })
)

export { recoverHaEmitterEpic }
