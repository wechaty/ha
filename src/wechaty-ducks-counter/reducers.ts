/**
 * Typesafe-Actions Reference Project
 *  https://codesandbox.io/s/github/piotrwitek/typesafe-actions/tree/master/codesandbox
 */
import { createReducer } from 'typesafe-actions'
import { DeepReadonly } from 'utility-types'

import * as actions from './actions'

const initialState: DeepReadonly<{
  mo: number,
  mt: number,
}> = {
  mo: 0,
  mt: 0,
}

const reducer = createReducer(initialState)
  .handleAction(actions.moMessage, state => ({ ...state, mo: state.mo + 1 }))
  .handleAction(actions.mtMessage, state => ({ ...state, mt: state.mt + 1 }))

// reducer(initialState, actions.moMessage()) // => 4

export default reducer
export type State = ReturnType<typeof reducer>
