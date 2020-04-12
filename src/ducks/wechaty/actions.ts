import {
  createAction,
  createAsyncAction,
}                       from 'typesafe-actions'

import {
  Wechaty,
  Message,
}             from 'wechaty'

// import {
//   EventResetPayload,
// }                       from 'wechaty-puppet'

import * as types from './types'
import { Sayable } from 'wechaty/dist/src/types'

const prepareTurnOnSwitch  = (wechaty: Wechaty, status: true | 'pending') => ({ status, wechaty })
const prepareTurnOffSwitch = (wechaty: Wechaty, status: true | 'pending') => ({ status, wechaty })

const prepareScanEvent     = (wechaty: Wechaty, qrcode: string)   => ({ qrcode, wechaty })
const prepareLoginEvent    = (wechaty: Wechaty, userName: string) => ({ userName, wechaty })
const prepareLogoutEvent   = (wechaty: Wechaty) => ({ wechaty })
const prepareMessageEvent  = (message: Message) => ({ message })
const prepareDongEvent     = (wechaty: Wechaty, data: string) => ({ data, wechaty })

export const turnOnSwitch  = createAction(types.SWITCH_ON,  prepareTurnOnSwitch)()
export const turnOffSwitch = createAction(types.SWITCH_OFF, prepareTurnOffSwitch)()

export const scanEvent    = createAction(types.EVENT_SCAN,    prepareScanEvent)()
export const loginEvent   = createAction(types.EVENT_LOGIN,   prepareLoginEvent)()
export const logoutEvent  = createAction(types.EVENT_LOGOUT,  prepareLogoutEvent)()
export const messageEvent = createAction(types.EVENT_MESSAGE, prepareMessageEvent)()
export const dongEvent    = createAction(types.EVENT_DONG,    prepareDongEvent)()

/**
 * Async
 */
export const dingAsync = createAsyncAction(
  types.DING_REQUEST,
  types.DING_SUCCESS,
  types.DING_FAILURE,
)<{ data: string, wechaty: Wechaty }, void, Error>()

export const resetAsync = createAsyncAction(
  types.RESET_REQUEST,
  types.RESET_SUCCESS,
  types.RESET_FAILURE,
)<{ data: string, wechaty: Wechaty }, void, Error>()

export const sayAsync = createAsyncAction(
  types.SAY_REQUEST,
  types.SAY_SUCCESS,
  types.SAY_FAILURE,
)<{ sayable: Sayable, text: string }, void, Error>()
