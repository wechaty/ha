import { Dispatch } from 'redux'

import * as actions from './actions'

const ding = (dispatch: Dispatch) => (haId: string, data: string) => {
  return dispatch(actions.ding(haId, data))
}

export {
  ding,
}
