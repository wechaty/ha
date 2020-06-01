import { Wechaty }    from 'wechaty'

import { HAWechaty }  from '../'

import { State } from './reducers'

const isWechatyAvailable = (state: State) => (wechatyOrId: string | Wechaty): boolean => {
  if (wechatyOrId instanceof Wechaty) {
    wechatyOrId = wechatyOrId.id
  }
  return !!(state.availability[wechatyOrId])
}

const isHaAvailable = (state: State) => (haOrId?: string | HAWechaty): boolean => {
  if (!haOrId) {
    return Object.values(state.availability)
      .filter(Boolean)
      .length > 0
  }

  if (haOrId instanceof HAWechaty) {
    haOrId = haOrId.id
  }

  const isWithHa    = (wechatyId: string) => state.cluster[wechatyId] === haOrId
  const isAvailable = (wechatyId: string) => !!(state.availability[wechatyId])

  return Object.keys(state.cluster)
    .filter(isWithHa)
    .filter(isAvailable)
    .length > 0
}

const getHaByWechaty = (state: State) => (wechatyOrId: string | Wechaty): string => {
  if (wechatyOrId instanceof Wechaty) {
    wechatyOrId = wechatyOrId.id
  }

  const haId = state.cluster[wechatyOrId]
  if (!haId) {
    throw new Error('no haId')
  }
  return haId
}

export {
  getHaByWechaty,
  isHaAvailable,
  isWechatyAvailable,
}
