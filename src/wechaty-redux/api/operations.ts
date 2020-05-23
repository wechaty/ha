import { Dispatch } from 'redux'

import * as actions from './actions'

const ding = (dispatch: Dispatch) => (wechatyId: string, data: string) => {
  return dispatch(actions.ding(wechatyId, data))
}

export {
  ding,
}
