import { createReducer } from 'typesafe-actions'
import { DeepReadonly } from 'utility-types'

import { ContactPayload } from 'wechaty-puppet'

import * as actions from './actions'

const initialState: DeepReadonly<{
  [wechatyId: string]: undefined | {  // wechaty id
    qrcode? : string,
    user?   : ContactPayload,
  }
}> = {}

const reducer = createReducer(initialState)
  .handleAction(actions.scanEvent, (state, action) => ({
    ...state,
    [action.payload.wechatyId]: {
      ...state[action.payload.wechatyId],
      qrcode: action.payload.qrcode,
      user: undefined,
    },
  }))
  .handleAction(actions.loginUser, (state, action) => ({
    ...state,
    [action.payload.wechatyId]: {
      ...state[action.payload.wechatyId],
      qrcode: undefined,
      user: action.payload,
    },
  }))
  .handleAction(actions.logoutEvent, (state, action) => ({
    ...state,
    [action.payload.wechatyId]: undefined,
  }))

export type State = ReturnType<typeof reducer>
export default reducer
