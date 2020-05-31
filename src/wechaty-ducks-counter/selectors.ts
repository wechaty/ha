import { State } from './reducers'

const getMo = (state: State) => (wechatyId?: string) => {
  if (wechatyId) {
    return state.mo[wechatyId] || 0
  }
  const moCounterList = Object.values(state.mo).filter(Boolean) as number[]
  return moCounterList.reduce((acc, cur) => acc + cur, 0)
}
const getMt = (state: State) => (wechatyId?: string) => {
  if (wechatyId) {
    return state.mt[wechatyId] || 0
  }
  const mtCounterList = Object.values(state.mt).filter(Boolean) as number[]
  return mtCounterList.reduce((acc, cur) => acc + cur, 0)
}

export {
  getMo,
  getMt,
}
