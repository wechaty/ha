import {
  Contact,
  Message,

  Wechaty,
}             from 'wechaty'

import {
  MessageType,
}               from 'wechaty-puppet'

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

type PayloadWechaty = { payload: { wechaty: Wechaty } }
type PayloadMessage = { payload: { message: Message } }
type PayloadContact = { payload: { contact: Contact } }

const isFromOf    = (contact: Contact) => (action: PayloadMessage) => action.payload.message.from()!.id === contact.id

const isMessageFrom     = (wechaty: Wechaty)  => (action: PayloadMessage) => action.payload.message.wechaty.id === wechaty.id
const isMessageFromSelf = (isSelf = true)     => (action: PayloadMessage) => action.payload.message.self() === isSelf

const isMessageType = (type: MessageType) => (action: ReturnType<typeof wechatyActions.messageEvent>) => action.payload.message.type() === type
const isMessageText = (text: string)     => (action: ReturnType<typeof wechatyActions.messageEvent>) => action.payload.message.text() === text
const toWechaty   = (action: PayloadWechaty | PayloadContact | PayloadMessage) => {
  const payload = action.payload
  const wechaty = 'wechaty' in payload ? payload.wechaty
    : 'message' in payload ? payload.message.wechaty
      : 'contact' in payload ? payload.contact.wechaty
        : undefined
  if (!wechaty) {
    throw new Error('no wechaty found')
  }
  return wechaty
}

const isMessageTypeText = isMessageType(Message.Type.Text)
const isMessageTextDong = isMessageText(DONG)

const isChatieOA  = (action: ReturnType<typeof wechatyActions.messageEvent>) => isFromOf(toChatieOA(action.payload.message.wechaty))(action)
const isDong      = (action: ReturnType<typeof wechatyActions.messageEvent>) => isMessageText(DONG)(action)

const isNotSelf   = (message: Message) => !message.self()

const sayDing = (contact: Contact) => contact.say(DING)

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
  isChatieOA,
  isDong,
  isFromOf,
  isMessageFrom,
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

  sayDing,
}
