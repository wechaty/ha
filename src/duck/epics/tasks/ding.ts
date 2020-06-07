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
  from,
  of,
}               from 'rxjs'
import {
  catchError,
  ignoreElements,
}                   from 'rxjs/operators'

import {
  DING,
}             from '../config'

import {
  getWechaty,
  Duck as WechatyDuck,
}                       from 'wechaty-redux'

// import {
//   State,
// }               from './reducers'

// import * as selectors from './selectors'
import * as actions   from './actions'

// import {
//   PayloadAllId,
// }                   from './config'

// const emitError$ = <T extends { payload: PayloadAllId }>(action: T, state: State) => (error: any) => {
//   const wechaty = getWechaty(action.payload.wechatyId)
//   const ha = selectors.getHAOfWechatyId(state, wechaty.id)
//   wechaty.emit('error', error)
//   ha.emit('error', error)
//   return EMPTY
// }

const ding$ = (action: ReturnType<typeof actions.ding>) => from(
  getWechaty(action.payload.wechatyId)
    .Contact.load(action.payload.contactId)
    .say(DING)
).pipe(
  ignoreElements(),
  catchError(e => of(
    WechatyDuck.actions.errorEvent(
      action.payload.wechatyId,
      { data: String(e) },
    )
  )),
)

export {
  ding$,
  // emitError$,
}
