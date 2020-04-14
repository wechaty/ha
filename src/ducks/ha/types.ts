import { DeepReadonly } from 'utility-types'
import { Wechaty }      from 'wechaty'

import { HAWechaty } from '../../ha-wechaty'

export const WECHATY_ADD = 'HAWechaty/ha/WECHATY_ADD'
export const WECHATY_DEL = 'HAWechaty/ha/WECHATY_DEL'

export const WECHATY_FAIL    = 'HAWechaty/ha/WECHATY_FAIL'
export const WECHATY_RECOVER = 'HAWechaty/ha/WECHATY_RECOVER'

export const HA_FAIL    = 'HAWechaty/ha/FAIL'
export const HA_RECOVER = 'HAWechaty/ha/RESTORE'

export const HA_DONG = 'HAWechaty/ha/DONG'

/**
 * Async
 */
export const HA_DING_REQUEST = 'HAWechaty/ha/DING_REQUEST'
export const HA_DING_SUCCESS = 'HAWechaty/ha/DING_SUCCESS'
export const HA_DING_FAILURE = 'HAWechaty/ha/DING_FAILURE'

export type State = DeepReadonly<{
  availability: {
    [wechatyId: string]: undefined | boolean  // the wechaty available or not
  }
  cluster: {
    [wechatyId: string]: undefined | string // wechatyId to haId
  },
  ha: {
    [haId: string]: undefined | HAWechaty,
  }
  wechaty: {
    [wechatyId: string]: undefined | Wechaty
  }
}>
