import { createReducer } from 'typesafe-actions'

import * as actions from './actions'
import * as types   from './types'

const initialState: types.State = {}

const wechatyReducer = createReducer(initialState)
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

/**
 * https://redux-toolkit.js.org/usage/usage-with-typescript#building-type-safe-reducer-argument-objects
 */
// const logonoffReducder = createReducer(0, builder =>
//   builder
//     .addCase(types.SCAN, (state, action) => {
//       // action is inferred correctly here
//       console.info(state, action.payload)
//     })
//     .addCase(types.LOGIN, (state, action) => {
//       console.info(state, action)
//     })
//     .addCase(types.LOGOUT, (state, action) => {
//       console.info(state, action)
//     })
// )

export default wechatyReducer
