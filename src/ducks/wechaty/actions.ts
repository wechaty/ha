import {
  createAction,
  createAsyncAction,
}                       from 'typesafe-actions'

import {
  Wechaty,
  Message,
  Friendship,
  Contact,
  RoomInvitation,
  Room,
}             from 'wechaty'

// import {
//   EventResetPayload,
// }                       from 'wechaty-puppet'

import { Sayable } from 'wechaty/dist/src/types'

import types from './types'
import { EventScanPayload } from 'wechaty-puppet'

const prepareTurnOnSwitch  = (wechaty: Wechaty, status: true | 'pending') => ({ status, wechaty })
const prepareTurnOffSwitch = (wechaty: Wechaty, status: true | 'pending') => ({ status, wechaty })

const prepareContact        = (contact: Contact)                => ({ contact })
const prepareData           = (wechaty: Wechaty, data: string)  => ({ data, wechaty })
const prepareFriendship     = (friendship: Friendship)          => ({ friendship })
const prepareMessage        = (message: Message)                => ({ message })
const prepareRoomInvitation = (roomInvitation: RoomInvitation)  => ({ roomInvitation })
const prepareRoomJoin       = (room: Room, inviteeList: Contact[], inviter: Contact, date: Date)  => ({ date, inviteeList, inviter, room })
const prepareRoomLeave      = (room: Room, removeeList: Contact[], remover: Contact, date: Date)  => ({ date, removeeList, remover, room })
const prepareRoomTopic      = (room: Room, newTopic: string, oldTopic: string, changer: Contact, date: Date)  => ({ changer, date, newTopic, oldTopic, room })
const prepareScanPayload    = (wechaty: Wechaty, data: EventScanPayload)  => ({ data, wechaty })

/**
 * Actions: StateSwitch
 */
const turnOnSwitch  = createAction(types.SWITCH_ON,  prepareTurnOnSwitch)()
const turnOffSwitch = createAction(types.SWITCH_OFF, prepareTurnOffSwitch)()

/**
 * Actions: Events
 */
const dongEvent       = createAction(types.EVENT_DONG,        prepareData)()
const errorEvent      = createAction(types.EVENT_ERROR,       prepareData)()
const friendshipEvent = createAction(types.EVENT_FRIENDSHIP,  prepareFriendship)()
const heartbeatEvent  = createAction(types.EVENT_HEARTBEAT,   prepareData)()
const loginEvent      = createAction(types.EVENT_LOGIN,       prepareContact)()
const logoutEvent     = createAction(types.EVENT_LOGOUT,      prepareContact)()
const messageEvent    = createAction(types.EVENT_MESSAGE,     prepareMessage)()
const readyEvent      = createAction(types.EVENT_READY,       prepareData)()
const resetEvent      = createAction(types.EVENT_RESET,       prepareData)()
const roomInviteEvent = createAction(types.EVENT_ROOM_INVITE, prepareRoomInvitation)()
const roomJoinEvent   = createAction(types.EVENT_ROOM_JOIN,   prepareRoomJoin)()
const roomLeaveEvent  = createAction(types.EVENT_ROOM_LEAVE,  prepareRoomLeave)()
const roomTopicEvent  = createAction(types.EVENT_ROOM_TOPIC,  prepareRoomTopic)()
const scanEvent       = createAction(types.EVENT_SCAN,        prepareScanPayload)()

/**
 * Actions: VOID APIs
 */
const ding  = createAction(types.DING,  prepareData)()
const reset = createAction(types.RESET, prepareData)()

/**
 * Actions: Non-Void APIs
 */
const sayAsync = createAsyncAction(
  types.SAY_REQUEST,
  types.SAY_SUCCESS,
  types.SAY_FAILURE,
)<{ sayable: Sayable, text: string }, void, Error>()

export default {
  ...{
    turnOffSwitch,
    turnOnSwitch,
  },

  ...{
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
  },

  ding,
  reset,

  sayAsync,
}
