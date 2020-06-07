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
import { Message }    from 'wechaty'
import { isActionOf } from 'typesafe-actions'
import {
  filter,
  map,
  mergeMap,
}                     from 'rxjs/operators'

import { Epic }       from 'redux-observable'

import {
  Duck as WechatyDuck,
}                       from 'wechaty-redux'

import {
  DONG,
}                       from '../../config'

import * as actions     from '../actions'

const messageToDong = (message: Message) => actions.dongHa(message.wechaty.id, message.id)

/**
 * In:  WechatyDuck.actions.messageEvent
 * Out: actions.dongHA
 */
const dongEpic: Epic = action$ => action$.pipe(
  filter(isActionOf(WechatyDuck.actions.messageEvent)),
  mergeMap(WechatyDuck.utils.toMessage$),
  filter(WechatyDuck.utils.isTextMessage(DONG)),
  map(messageToDong),
)

export { dongEpic }
