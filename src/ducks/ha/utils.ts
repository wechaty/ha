import {
  getHA,
}                   from '../../ha-wechaty'
import {
  getWechaty,
}                   from '../../wechaty-redux'

import {
  Contact,
  Message,
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
  PayloadMessageId,
}                   from './config'

import {
  actions as wechatyActions,
}                             from '../wechaty/'

/**
 * Increase or Decrease a random time on the target seconds
 * based on the `factor`
 * @param seconds base number of target seconds
 * @returns milliseconds
 */
const milliAroundSeconds = (
  seconds: number,
  factor = 1 / 6,
) => {
  const ms = seconds * 1000

  const base = ms * (1 - factor)
  const vari = ms * factor * 2 * Math.random()

  const finalTime = base + Math.round(vari)
  return finalTime
}

const isFromOf = (contact: Contact) => <T extends { payload: PayloadMessageId }>(action: T) => getWechaty(action.payload.wechatyId)
  .Message.load(action.payload.messageId)
  .from()!.id === contact.id

const isMessageFromSelf = (isSelf = true) => <T extends { payload: PayloadMessageId }>(action: T) => getWechaty(action.payload.wechatyId)
  .Message.load(action.payload.messageId)
  .self() === isSelf

const isMessageType = (type: MessageType) => (action: ReturnType<typeof wechatyActions.messageEvent>) => getWechaty(action.payload.wechatyId)
  .Message.load(action.payload.messageId)
  .type() === type

const isMessageText = (text: string) => (action: ReturnType<typeof wechatyActions.messageEvent>) => getWechaty(action.payload.wechatyId)
  .Message.load(action.payload.messageId)
  .text() === text

const belongsToWechaty = <T extends { payload: PayloadWechatyId }>(wechatyId: string) => (action: T) => action.payload.wechatyId === wechatyId

// const payloadToWechaty = <T extends PayloadAllId>(payloadAll: T): Wechaty => {
//   const payload = payloadAll as PayloadAllId
//   const wechaty = 'wechaty' in payload ? payload.wechaty
//     : 'message' in payload ? payload.message.wechaty
//       : 'contact' in payload ? payload.contact.wechaty
//         : undefined
//   if (!wechaty) {
//     throw new Error('no wechaty found')
//   }
//   return wechaty
// }

const isMessageTypeText = isMessageType(Message.Type.Text)
const isMessageTextDong = isMessageText(DONG)

// const isChatieOA = (action: ReturnType<typeof wechatyActions.messageEvent>) => getWechaty(action.payload.wechatyId)
//   .Message.load(action.payload.messageId)
//   .from()!.id === CHATIE_OA_ID

const isDong      = (action: ReturnType<typeof wechatyActions.messageEvent>) => isMessageText(DONG)(action)

const isNotSelf   = (message: Message) => !message.self()

const sayDingTo = (wechatyId: string, contactId: string) => getWechaty(wechatyId)
  .Contact.load(contactId)
  .say(DING)

const toChatieOA = (wechatyId: string): Contact => {
  const wechaty = getWechaty(wechatyId)
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

export {
  belongsToWechaty,
  // isChatieOA,
  isDong,
  isFromOf,
  isMessageFromSelf,
  isMessageText,
  isMessageType,
  isNotSelf,
  toChatieOA,

  isMessageTextDong,
  isMessageTypeText,

  sayDingTo,
}

interface PayloadHAId { haId: string }
interface PayloadWechatyId { wechatyId: string }
// interface PayloadMessageId { wechatyId: string, messageId: string }
// interface PayloadContactId { wechatyId: string, contactId: string }

// type PayloadAllId = PayloadWechatyId | PayloadMessageId | PayloadContactId

const toWechaty = <T extends { payload: PayloadWechatyId }>(action: T) => getWechaty(action.payload.wechatyId)
const toHA      = <T extends { payload: PayloadHAId      }>(action: T) => getHA(action.payload.haId)

export {
  milliAroundSeconds,
  toWechaty,
  toHA,
}
