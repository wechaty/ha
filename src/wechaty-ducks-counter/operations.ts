import { Dispatch } from 'redux'

import * as actions from './actions'

const mo = (dispatch: Dispatch) => (wechatyId: string) => {
  return dispatch(actions.moMessage(wechatyId))
}

const mt = (dispatch: Dispatch) => (wechatyId: string) => {
  return dispatch(actions.mtMessage(wechatyId))
}

export {
  mo,
  mt,
}
