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
/* eslint-disable no-whitespace-before-property */
import {
  ActionType,
  createReducer,
}                             from 'typesafe-actions'
import type { DeepReadonly }  from 'utility-types'

import * as actions from './actions.js'

const initialState: DeepReadonly<{
  availability: {
    [wechatyId: string]: boolean  // the wechaty available or not
  }
  cluster: {
    [wechatyId: string]: string // wechatyId to haId
  },
}> = {
  availability : {},   // map wechaty id to availability (true or false)
  cluster      : {},   // map wechaty id to ha id
}

const reducer = createReducer<
  typeof initialState,
  ActionType<typeof actions>
>(initialState)
  .handleAction(actions.failureWechaty, (state, action) => ({
    ...state,
    availability: {
      ...state.availability,
      [action.payload.wechatyId]: false,
    },
  }))
  .handleAction(actions.recoverWechaty, (state, action) => ({
    ...state,
    availability: {
      ...state.availability,
      [action.payload.wechatyId]: true,
    },
  }))
  .handleAction(actions.addWechaty, (state, action) => ({
    ...state,
    cluster: {
      ...state.cluster,
      [action.payload.wechatyId]: action.payload.haId,
    },
  }))
  .handleAction(actions.delWechaty, (state, action) => {
    const newState = {
      ...state,
      availability: {
        ...state.availability,
      },
      cluster: {
        ...state.cluster,
      },
    }
    delete newState.availability[action.payload.wechatyId]
    delete newState.cluster     [action.payload.wechatyId]
    return newState
  })

export type State = ReturnType<typeof reducer>

export default reducer
