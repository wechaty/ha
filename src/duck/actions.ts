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
  createAction,
}                       from 'typesafe-actions'

import * as types from './types'

const prepareHA         = (haId: string)      => ({ haId })
const prepareWechaty    = (wechatyId: string) => ({ wechatyId })

const prepareContact    = (wechatyId: string, contactId: string)  => ({ contactId, wechatyId })
const prepareHAWechaty  = (haId: string, wechatyId: string)  => ({ haId, wechatyId })

const prepareDong = (wechatyId: string, messageId: string) => ({ messageId, wechatyId })

/**
 * Actions
 */
const addWechaty = createAction(types.WECHATY_ADD, prepareHAWechaty)()
const delWechaty = createAction(types.WECHATY_DEL, prepareHAWechaty)()

const failureHA = createAction(types.HA_FAILURE, prepareHA)()
const recoverHA = createAction(types.HA_RECOVER, prepareHA)()

const failureWechaty = createAction(types.WECHATY_FAILURE, prepareWechaty)()
const recoverWechaty = createAction(types.WECHATY_RECOVER, prepareWechaty)()

const ding = createAction(types.DING, prepareContact)()
const dong = createAction(types.DONG, prepareDong)()

const noop = createAction(types.NOOP)()

export {
  addWechaty,
  delWechaty,

  ding,
  dong,

  failureHA,
  recoverHA,

  failureWechaty,
  recoverWechaty,

  noop,
}
