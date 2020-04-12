import {
  createReducer,
  Action,
}                   from '@reduxjs/toolkit'

import * as types from './types'
import * as actions from './actions'

const initialState: types.State = {}

const scanReducer = (state: types.State, action: Action) => {
  if (actions.scanEvent.match(action)) {
    return {
      ...state,
      [action.payload.wechaty.id]: {
        qrcode: action.payload.qrcode,
      },
    }
  }
  return state
}

const loginReducer = (state: types.State, action: Action) => {
  if (actions.loginEvent.match(action)) {
    return {
      ...state,
      [action.payload.wechaty.id]: {
        userName: action.payload.userName,
      },
    }
  }
  return state
}

const logoutReducer = (state: types.State, action: Action) => {
  if (actions.logoutEvent.match(action)) {
    return {
      ...state,
      [action.payload.wechaty.id]: {},
    }
  }
  return state
}

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

const logonoffReducer = createReducer(
  initialState,
  {
    [types.EVENT_SCAN]    : scanReducer,
    [types.EVENT_LOGIN]   : loginReducer,
    [types.EVENT_LOGOUT]  : logoutReducer,
    // [types.EVENT_MESSAGE] : messageReducer,
  },
)

export default logonoffReducer
