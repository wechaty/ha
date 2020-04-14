import { State } from './reducers'

function status (
  state     : State,
  wechatyId : string,
) {
  if (wechatyId in state) {
    return state[wechatyId]
  }
  return {}
}

export default {
  status,
}
