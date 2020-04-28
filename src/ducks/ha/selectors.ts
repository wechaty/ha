import { Wechaty }    from 'wechaty'

import { HAWechaty }  from '../../ha-wechaty'

import { State } from './reducers'

const getWechatyAvailable = (state: State, wechaty: Wechaty): boolean => !!(state.availability[wechaty.id])

const getHAAvailable = (state: State, haOrWechaty?: HAWechaty | Wechaty): boolean => {
  if (!haOrWechaty) {
    return Object.values(state.availability)
      .filter(Boolean)
      .length > 0
  }

  if (haOrWechaty instanceof Wechaty) {
    const wechatyId = haOrWechaty.id
    const haId = state.cluster[wechatyId]
    if (!haId) {
      throw new Error('no haId')
    }
    const ha = state.ha[haId]
    if (!ha) {
      throw new Error('no ha')
    }
    haOrWechaty = ha
  }

  if (!(haOrWechaty instanceof HAWechaty)) {
    throw new Error('unknown param: ' + typeof haOrWechaty)
  }

  const haId = haOrWechaty.id
  const isWithHa    = (wechatyId: string) => state.cluster[wechatyId] === haId
  const isAvailable = (wechatyId: string) => !!(state.availability[wechatyId])

  return Object.keys(state.cluster)
    .filter(isWithHa)
    .filter(isAvailable)
    .length > 0
}

const getHA = (state: State, wechaty: Wechaty) => {
  const haId = state.cluster[wechaty.id]
  if (!haId) {
    throw new Error('no haId')
  }
  const ha = state.ha[haId]
  if (!ha) {
    throw new Error('no ha')
  }
  return ha
}

export default {
  getHA,
  getHAAvailable,
  getWechatyAvailable,
}
