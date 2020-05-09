/* eslint-disable sort-keys */
import {
  createAction,
  createAsyncAction,
}                       from 'typesafe-actions'

import {
  Wechaty,
  Sayable,
}             from 'wechaty'

import {
  EventDongPayload,
  EventErrorPayload,
  EventScanPayload,
  EventRoomTopicPayload,
  EventRoomLeavePayload,
  EventRoomJoinPayload,
  EventRoomInvitePayload,
  EventReadyPayload,
  EventMessagePayload,
  EventLogoutPayload,
  EventLoginPayload,
  EventHeartbeatPayload,
  EventFriendshipPayload,
  EventResetPayload,
}                             from 'wechaty-puppet'

import cuid from 'cuid'

import * as types from './types'

/**
 * Event Actions' Payloads
 */
const prepareTurnOnSwitch  = (wechaty: Wechaty, status: true | 'pending') => ({ status, wechatyId: wechaty.id })
const prepareTurnOffSwitch = (wechaty: Wechaty, status: true | 'pending') => ({ status, wechatyId: wechaty.id })

const prepareDong           = (wechaty: Wechaty, payload: EventDongPayload)       => ({ ...payload, wechatyId: wechaty.id })
const prepareError          = (wechaty: Wechaty, payload: EventErrorPayload)      => ({ ...payload, wechatyId: wechaty.id })
const prepareHeartbeat      = (wechaty: Wechaty, payload: EventHeartbeatPayload)  => ({ ...payload, wechatyId: wechaty.id })
const prepareReady          = (wechaty: Wechaty, payload: EventReadyPayload)      => ({ ...payload, wechatyId: wechaty.id })
const prepareReset          = (wechaty: Wechaty, payload: EventResetPayload)      => ({ ...payload, wechatyId: wechaty.id })
const prepareFriendship     = (wechaty: Wechaty, payload: EventFriendshipPayload) => ({ ...payload, wechatyId: wechaty.id })
const prepareLogin          = (wechaty: Wechaty, payload: EventLoginPayload)      => ({ ...payload, wechatyId: wechaty.id })
const prepareLogout         = (wechaty: Wechaty, payload: EventLogoutPayload)     => ({ ...payload, wechatyId: wechaty.id })
const prepareMessage        = (wechaty: Wechaty, payload: EventMessagePayload)    => ({ ...payload, wechatyId: wechaty.id })
const prepareRoomInvitation = (wechaty: Wechaty, payload: EventRoomInvitePayload) => ({ ...payload, wechatyId: wechaty.id })
const prepareRoomJoin       = (wechaty: Wechaty, payload: EventRoomJoinPayload)   => ({ ...payload, wechatyId: wechaty.id })
const prepareRoomLeave      = (wechaty: Wechaty, payload: EventRoomLeavePayload)  => ({ ...payload, wechatyId: wechaty.id })
const prepareRoomTopic      = (wechaty: Wechaty, payload: EventRoomTopicPayload)  => ({ ...payload, wechatyId: wechaty.id })
const prepareScan           = (wechaty: Wechaty, payload: EventScanPayload)       => ({ ...payload, wechatyId: wechaty.id })

/**
 * Actions: StateSwitch
 */
const turnOnSwitch  = createAction(types.SWITCH_ON,  prepareTurnOnSwitch)()
const turnOffSwitch = createAction(types.SWITCH_OFF, prepareTurnOffSwitch)()

/**
 * Actions: Events
 */
const dongEvent       = createAction(types.EVENT_DONG,        prepareDong)()
const errorEvent      = createAction(types.EVENT_ERROR,       prepareError)()
const friendshipEvent = createAction(types.EVENT_FRIENDSHIP,  prepareFriendship)()
const heartbeatEvent  = createAction(types.EVENT_HEARTBEAT,   prepareHeartbeat)()
const loginEvent      = createAction(types.EVENT_LOGIN,       prepareLogin)()
const logoutEvent     = createAction(types.EVENT_LOGOUT,      prepareLogout)()
const messageEvent    = createAction(types.EVENT_MESSAGE,     prepareMessage)()
const readyEvent      = createAction(types.EVENT_READY,       prepareReady)()
const resetEvent      = createAction(types.EVENT_RESET,       prepareReset)()
const roomInviteEvent = createAction(types.EVENT_ROOM_INVITE, prepareRoomInvitation)()
const roomJoinEvent   = createAction(types.EVENT_ROOM_JOIN,   prepareRoomJoin)()
const roomLeaveEvent  = createAction(types.EVENT_ROOM_LEAVE,  prepareRoomLeave)()
const roomTopicEvent  = createAction(types.EVENT_ROOM_TOPIC,  prepareRoomTopic)()
const scanEvent       = createAction(types.EVENT_SCAN,        prepareScan)()

/**
 * Actions: VOID APIs
 */
const prepareData = (wechatyId: string, data: string)  => ({ data, wechatyId })

const ding  = createAction(types.DING,  prepareData)()
const reset = createAction(types.RESET, prepareData)()

/**
 * Actions: Non-Void APIs
 */
const prepareSayRequest = (wechaty: Wechaty, sayable: Sayable, text: string) => ({ id: cuid(), wechatyId: wechaty.id, conversationId: sayable.id, text })
const prepareSaySuccess = (wechaty: Wechaty, id: string, messageId?: string) => ({ id, wechatyId: wechaty.id, messageId })
const prepareSayFailure = (wechaty: Wechaty, id: string, error: Error)       => ({ id, wechatyId: wechaty.id, error: error.toString() })

const sayAsync = createAsyncAction(
  [types.SAY_REQUEST, prepareSayRequest],
  [types.SAY_SUCCESS, prepareSaySuccess],
  [types.SAY_FAILURE, prepareSayFailure],
)()

export {
  turnOffSwitch,
  turnOnSwitch,

  dongEvent,
  errorEvent,
  friendshipEvent,
  heartbeatEvent,
  loginEvent,
  logoutEvent,
  messageEvent,
  readyEvent,
  resetEvent,
  roomInviteEvent,
  roomJoinEvent,
  roomLeaveEvent,
  roomTopicEvent,
  scanEvent,

  ding,
  reset,

  sayAsync,
}
