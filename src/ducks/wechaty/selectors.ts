import { State } from './reducers'

function getStatus (
  state     : State,
  wechatyId : string,
) {
  if (wechatyId in state) {
    return state[wechatyId]
  }
  return {}
}

export {
  getStatus,
}
