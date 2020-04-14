import { Wechaty }    from 'wechaty'
import { HAWechaty }  from '../../'

import { State } from './reducers'

const getAvailable = (state: State, haOrWechaty?: HAWechaty | Wechaty): boolean => {
  if (!haOrWechaty) {
    return Object.values(state.availability)
      .filter(Boolean)
      .length > 0
  }

  if (haOrWechaty instanceof HAWechaty) {
    const haWechatyId = haOrWechaty.id
    const isWithHa    = (wechatyId: string) => state.cluster[wechatyId] === haWechatyId
    const isAvailable = (wechatyId: string) => !!(state.availability[wechatyId])

    return Object.keys(state.cluster)
      .filter(isWithHa)
      .filter(isAvailable)
      .length > 0
  }

  if (haOrWechaty instanceof Wechaty) {
    const wechatyId = haOrWechaty.id
    return !!(state.availability[wechatyId])
  }

  throw new Error('unknown param: ' + typeof haOrWechaty)
}

export default {
  getAvailable,
}
