/**
 * Typesafe-Actions Reference Project
 *  https://codesandbox.io/s/github/piotrwitek/typesafe-actions/tree/master/codesandbox
 */
import { createReducer } from 'typesafe-actions'

import * as types from './types'
import * as actions from './actions'

const initialState: types.State = {
  mo: 0,
  mt: 0,
}

// using action-creators
const counterReducer = createReducer(initialState)
  // state and action type is automatically inferred and return type is validated to be exact type
  .handleAction(actions.moMessage, (state) => ({ ...state, mo: state.mo + 1 }))
  .handleAction(actions.mtMessage, (state) => ({ ...state, mo: state.mt + 1 }))

// counterReducer(initialState, actions.moMessage()) // => 4
// counterReducer(0, increment()); // => 1

export default counterReducer
