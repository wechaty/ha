import {
  ActionType,
  createReducer,
}                         from 'typesafe-actions'
import { DeepReadonly }   from 'utility-types'

import * as actions from './actions'

const initialState: DeepReadonly<{
  availability: {
    [wechatyId: string]: undefined | boolean  // the wechaty available or not
  }
  cluster: {
    [wechatyId: string]: undefined | string // wechatyId to haId
  },
}> = {
  availability : {},   // map wechaty id to availability (true or false)
  cluster      : {},   // map wechaty id to ha id
}

const reducer = createReducer<typeof initialState, ActionType<typeof actions>>(initialState)
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
  .handleAction(actions.delWechaty, (state, action) => ({
    ...state,
    availability: {
      ...state.availability,
      [action.payload.wechatyId]: undefined,
    },
    cluster: {
      ...state.cluster,
      [action.payload.wechatyId]: undefined,
    },
  }))

export type State = ReturnType<typeof reducer>

export default reducer
