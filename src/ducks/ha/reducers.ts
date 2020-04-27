import { createReducer }  from 'typesafe-actions'
import { DeepReadonly }   from 'utility-types'

import { Wechaty }      from 'wechaty'

import { HAWechaty } from '../../ha-wechaty'

import actions from './actions'

const initialState: DeepReadonly<{
  availability: {
    [wechatyId: string]: undefined | boolean  // the wechaty available or not
  }
  cluster: {
    [wechatyId: string]: undefined | string // wechatyId to haId
  },
  ha: {
    [haId: string]: undefined | HAWechaty,
  }
  wechaty: {
    [wechatyId: string]: undefined | Wechaty
  }
}> = {
  availability : {},   // map wechaty id to availability (true or false)
  cluster      : {},   // map wechaty id to ha id

  ha           : {},   // map ha id to instance
  wechaty      : {},   // map wechaty id to instance
}

const reducer = createReducer(initialState)
  .handleAction(actions.failureWechaty, (state, action) => ({
    ...state,
    availability: {
      ...state.availability,
      [action.payload.wechaty.id]: false,
    },
  }))
  .handleAction(actions.recoverWechaty, (state, action) => ({
    ...state,
    availability: {
      ...state.availability,
      [action.payload.wechaty.id]: true,
    },
  }))
  .handleAction(actions.addWechaty, (state, action) => ({
    ...state,
    cluster: {
      ...state.cluster,
      [action.payload.wechaty.id]: action.payload.ha.id,
    },
    ha: {
      ...state.ha,
      [action.payload.ha.id]: action.payload.ha,
    },
    wechaty: {
      ...state.wechaty,
      [action.payload.wechaty.id]: action.payload.wechaty,
    },
  }))
  .handleAction(actions.delWechaty, (state, action) => ({
    ...state,
    availability: {
      ...state.availability,
      [action.payload.wechaty.id]: undefined,
    },
    cluster: {
      ...state.cluster,
      [action.payload.wechaty.id]: undefined,
    },
    wechaty: {
      ...state.wechaty,
      [action.payload.wechaty.id]: undefined,
    },
  }))

export default reducer
export type State = ReturnType<typeof reducer>
