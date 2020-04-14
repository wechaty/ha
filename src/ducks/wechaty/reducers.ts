import { createReducer } from 'typesafe-actions'
import { DeepReadonly } from 'utility-types'

import actions from './actions'

const initialState: DeepReadonly<{
  [wechatyId: string]: undefined | {  // wechaty id
    qrcode?   : string,
    userName? : string,
  }
}> = {}

const reducer = createReducer(initialState)
  .handleAction(actions.scanEvent, (state, action) => ({
    ...state,
    [action.payload.wechaty.id]: {
      qrcode: action.payload.qrcode,
    },
  }))
  .handleAction(actions.loginEvent, (state, action) => ({
    ...state,
    [action.payload.wechaty.id]: {
      userName: action.payload.userName,
    },
  }))
  .handleAction(actions.logoutEvent, (state, action) => ({
    ...state,
    [action.payload.wechaty.id]: undefined,
  }))

export default reducer
export type State = ReturnType<typeof reducer>
