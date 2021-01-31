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
  takeUntil,
}                   from 'rxjs/operators'
import { Epic }     from 'redux-observable'

import * as HaDuck from '../../'

/**
 * Huan(202004):
 *  We are using `messageEvent` at here, not `heartbeatEvent` for reasons.
 *
 *  e.g.:
 *    `heartbeatEvent` is not suitable at here,
 *    because the puppet-service server will emit heartbeat no matter than WeChat protocol available or not.
 */
const takeUntilDong = <T>(wechatyId: string, action$: ReturnType<Epic>) => takeUntil<T>(
  action$.pipe(
    filter(isActionOf(HaDuck.actions.dongHa)),
    filter(action => action.payload.wechatyId === wechatyId),
  ),
)

export { takeUntilDong }
