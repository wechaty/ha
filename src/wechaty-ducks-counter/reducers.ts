/**
 * Typesafe-Actions Reference Project
 *  https://codesandbox.io/s/github/piotrwitek/typesafe-actions/tree/master/codesandbox
 */
import {
  createReducer,
  ActionType,
}                     from 'typesafe-actions'
import { DeepReadonly }  from 'utility-types'

import * as actions from './actions'

const initialState: DeepReadonly<{
  mo: {
    [wechatyId: string]: undefined | number,
  }
  mt:{
    [wechatyId: string]: undefined | number,
  },
}> = {
  mo: {},
  mt: {},
}

const reducer = createReducer<typeof initialState, ActionType<typeof actions>>(initialState)
  .handleAction(actions.moMessage, (state, action) => ({
    ...state,
    mo: {
      ...state.mo,
      [action.payload.wechatyId]: (state.mo[action.payload.wechatyId] || 0) + 1,
    },
  }))
  .handleAction(actions.mtMessage, (state, action) => ({
    ...state,
    mt: {
      ...state.mt,
      [action.payload.wechatyId]: (state.mt[action.payload.wechatyId] || 0) + 1,
    },
  }))

export default reducer
export type State = ReturnType<typeof reducer>
