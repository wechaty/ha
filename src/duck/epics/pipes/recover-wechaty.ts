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
  // empty,
  EMPTY,
}                     from 'rxjs'
import type { Duck as WechatyDuck } from 'wechaty-redux'

import { getBundle }  from '../../ducks.js'
import * as actions   from '../../actions.js'

type RecoverAction = ReturnType<typeof actions.dongHa> | ReturnType<typeof WechatyDuck.actions.loginEvent>

const recoverWechaty$ = (action: RecoverAction) => {
  /**
   * Need not recovery because it's available
   */
  if (getBundle().selectors.isWechatyAvailable(action.payload.wechatyId)) {
    return EMPTY // empty()
  }

  /**
   * Recover Wechaty
   */
  return of(actions.recoverWechaty(action.payload.wechatyId))
}

export { recoverWechaty$ }
