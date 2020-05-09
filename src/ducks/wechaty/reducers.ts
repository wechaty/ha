import { createReducer } from 'typesafe-actions'
import { DeepReadonly } from 'utility-types'

import * as actions from './actions'

import {
  getWechaty,
}               from '../../wechaty-redux'

const initialState: DeepReadonly<{
  [wechatyId: string]: undefined | {  // wechaty id
    qrcode?   : string,
    userName? : string,
  }
}> = {}

const reducer = createReducer(initialState)
  .handleAction(actions.scanEvent, (state, action) => ({
    ...state,
    [action.payload.wechatyId]: {
      qrcode: action.payload.qrcode,
    },
  }))
  .handleAction(actions.loginEvent, (state, action) => ({
    ...state,
    [action.payload.wechatyId]: {
      userName: getWechaty(action.payload.wechatyId).Contact.load(action.payload.contactId).name(),
    },
  }))
  .handleAction(actions.logoutEvent, (state, action) => ({
    ...state,
    [action.payload.wechatyId]: undefined,
  }))

export type State = ReturnType<typeof reducer>
export default reducer
