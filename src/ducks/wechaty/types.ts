import { DeepReadonly } from 'utility-types'

export const SWITCH_ON  = 'wechaty/SWITCH_ON'
export const SWITCH_OFF = 'wechaty/SWITCH_OFF'

export const EVENT_SCAN    = 'wechaty/EVENT_SCAN'
export const EVENT_LOGIN   = 'wechaty/EVENT_LOGIN'
export const EVENT_LOGOUT  = 'wechaty/EVENT_LOGOUT'
export const EVENT_MESSAGE = 'wechaty/EVENT_MESSAGE'
export const EVENT_DONG    = 'wechaty/EVENT_DONG'

/**
 * Async
 */
export const RESET_REQUEST  = 'wechaty/RESET_REQUEST'
export const RESET_SUCCESS  = 'wechaty/RESET_SUCCESS'
export const RESET_FAILURE  = 'wechaty/RESET_FAILURE'

export const SAY_REQUEST = 'wechaty/SAY_REQUEST'
export const SAY_SUCCESS = 'wechaty/SAY_SUCCESS'
export const SAY_FAILURE = 'wechaty/SAY_FAILURE'

export const DING_REQUEST = 'wechaty/DING_REQUEST'
export const DING_SUCCESS = 'wechaty/DING_SUCCESS'
export const DING_FAILURE = 'wechaty/DING_FAILURE'

export type State = DeepReadonly<{
  [wechatyId: string]: undefined | {  // wechaty id
    qrcode?   : string,
    userName? : string,
  }
}>
