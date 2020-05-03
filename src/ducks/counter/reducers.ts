/**
 * Typesafe-Actions Reference Project
 *  https://codesandbox.io/s/github/piotrwitek/typesafe-actions/tree/master/codesandbox
 */
import { createReducer } from 'typesafe-actions'
import { DeepReadonly } from 'utility-types'

import actions from './actions'
// import * as types from './types'

const initialState: DeepReadonly<{
  mo: number,
  mt: number,
}> = {
  mo: 0,
  mt: 0,
}

const reducer = createReducer(initialState)
  // .handleType(types.MESSAGE_MO, state => ({ ...state, mo: state.mo + 1 }))
  // .handleType(types.MESSAGE_MT, state => ({ ...state, mt: state.mt + 1 }))
  .handleAction(actions.moMessage, (state, _action) => ({ ...state, mo: state.mo + 1 }))
  .handleAction(actions.mtMessage, (state, _action) => ({ ...state, mt: state.mt + 1 }))

// reducer(initialState, actions.moMessage()) // => 4

export default reducer
export type State = ReturnType<typeof reducer>
