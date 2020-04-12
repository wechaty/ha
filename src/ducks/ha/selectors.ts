import { Wechaty }    from 'wechaty'
import { HAWechaty }  from '../../'

import * as types from './types'

export const getAvailable = (state: types.State, haOrWechaty: HAWechaty | Wechaty): boolean => {
  if (haOrWechaty instanceof Wechaty) {
    const wechatyId = haOrWechaty.id
    return !!(state.availability[wechatyId])

  } else if (haOrWechaty instanceof HAWechaty) {
    const haWechatyId = haOrWechaty.id
    const isWithHa    = (wechatyId: string) => state.cluster[wechatyId] === haWechatyId
    const isAvailable = (wechatyId: string) => !!(state.availability[wechatyId])

    return Object.keys(state.cluster)
      .filter(isWithHa)
      .filter(isAvailable)
      .length > 0
  }

  throw new Error('unknown param: ' + typeof haOrWechaty)

}
