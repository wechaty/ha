import {
  Contact,
  Message,

  Wechaty,
}             from 'wechaty'

import {
  MessageType,
}               from 'wechaty-puppet'

import {
  EMPTY,
}               from 'rxjs'

import {
  CHATIE_OA_ID,
  DING,
  DONG,
  log,
}             from '../../config'

import {
  actions as wechatyActions,
}                             from '../wechaty/'

// import * as actions from './actions'
import selectors from './selectors'
import { State } from './reducers'

interface PayloadWechaty { wechaty: Wechaty }
interface PayloadMessage { message: Message }
interface PayloadContact { contact: Contact }

type PayloadAll = PayloadWechaty | PayloadMessage | PayloadContact

const isFromOf    = (contact: Contact) => <T extends { payload: PayloadMessage }>(action: T) => action.payload.message.from()!.id === contact.id

const isMessageFromSelf = (isSelf = true)     => <T extends { payload: PayloadMessage }>(action: T) => action.payload.message.self() === isSelf

const isMessageType = (type: MessageType) => (action: ReturnType<typeof wechatyActions.messageEvent>) => action.payload.message.type() === type
const isMessageText = (text: string)     => (action: ReturnType<typeof wechatyActions.messageEvent>) => action.payload.message.text() === text

const belongsToWechaty = <T extends { payload: PayloadAll }>(wechaty: Wechaty) => (action: T) => toWechaty(action).id === wechaty.id

const payloadToWechaty = <T extends PayloadAll>(payloadAll: T): Wechaty => {
  const payload = payloadAll as PayloadAll
  const wechaty = 'wechaty' in payload ? payload.wechaty
    : 'message' in payload ? payload.message.wechaty
      : 'contact' in payload ? payload.contact.wechaty
        : undefined
  if (!wechaty) {
    throw new Error('no wechaty found')
  }
  return wechaty
}

const emitError$ = <T extends { payload: PayloadAll }>(action: T, state: State) => (error: any) => {
  const wechaty = payloadToWechaty(action.payload)
  const ha = selectors.getHA(state, wechaty)
  wechaty.emit('error', error)
  ha.emit('error', error)
  return EMPTY
}

const toWechaty = <T extends { payload: PayloadAll }>(action: T) => payloadToWechaty(action.payload)
// const toHA      = <T extends { payload: PayloadAll }>(action: T) => selectors.getHA(payloadToWechaty(action.payload)

const isMessageTypeText = isMessageType(Message.Type.Text)
const isMessageTextDong = isMessageText(DONG)

const isChatieOA  = (action: ReturnType<typeof wechatyActions.messageEvent>) => isFromOf(toChatieOA(action.payload.message.wechaty))(action)
const isDong      = (action: ReturnType<typeof wechatyActions.messageEvent>) => isMessageText(DONG)(action)

const isNotSelf   = (message: Message) => !message.self()

const sayDingTo = (contact: Contact) => contact.say(DING)

const toChatieOA = (wechaty: Wechaty): Contact => {
  const contact = wechaty.Contact.load(CHATIE_OA_ID)
  contact.ready().catch(e => {
    log.error('HAWechaty', 'heartbeat$ chatie(%s) contact.ready() rejection: %s', wechaty, e)
    const error = new Error(`

    In order to use HAWechaty, we need to follow WeChat Official Account "chatieio" first.
    See #1: https://github.com/wechaty/HAWechaty/issues/1

    `)
    wechaty.emit('error', error)
  })
  return contact
}

export default {
  belongsToWechaty,
  emitError$,
  isChatieOA,
  isDong,
  isFromOf,
  isMessageFromSelf,
  isMessageText,
  isMessageType,
  isNotSelf,
  toChatieOA,
  toWechaty,

  ...{
    isMessageTextDong,
    isMessageTypeText,
  },

  sayDingTo,
}
