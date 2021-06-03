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
  of,
  EMPTY,
}                     from 'rxjs'

import { Duck as WechatyDuck } from 'wechaty-redux'

import { getBundle }  from '../../ducks'
import * as actions   from '../../actions'

type RecoverAction = ReturnType<typeof actions.dongHa> | ReturnType<typeof WechatyDuck.actions.loginEvent>

const recoverHa$ = (action: RecoverAction) => {
  /**
   * Need not recovery because it's available
   */
  if (getBundle().selectors.isHaAvailableByWechaty(action.payload.wechatyId)) {
    return EMPTY
  }

  /**
   * Recover Wechaty
   */
  const haId = getBundle().selectors.getHaByWechaty(action.payload.wechatyId)
  return of(actions.recoverHa(haId))
}

export { recoverHa$ }
