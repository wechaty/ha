/**
 *   Wechaty Open Source Software - https://github.com/wechaty
 *
 *   @copyright 2016 Huan LI (李卓桓) <https://github.com/huan>, and
 *                   Wechaty Contributors <https://github.com/wechaty>.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import {
  Contact,
  Message,
}             from 'wechaty'

import {
  MessageType,
}               from 'wechaty-puppet'
import {
  getWechaty,
  Duck as wechatyDuck,
}                       from 'wechaty-redux'

import {
  getHa,
}                   from '../'
import {
  CHATIE_OA_ID,
  DONG,
  log,
}             from '../config'

// import {
//   PayloadMessageId,
// }                   from './schema'

interface PayloadMessageId { wechatyId: string, messageId: string }
interface PayloadHaId { haId: string }
interface PayloadWechatyId { wechatyId: string }

// type PayloadAllId = PayloadWechatyId | PayloadMessageId | PayloadContactId

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

// TODO
const isMessageFromSelf = (isSelf = true) => <T extends { payload: PayloadMessageId }>(action: T) => getWechaty(action.payload.wechatyId)
  .Message.load(action.payload.messageId)
  .self() === isSelf

const isMessageType = (type: MessageType) => (action: ReturnType<typeof wechatyDuck.actions.messageEvent>) => getWechaty(action.payload.wechatyId)
  .Message.load(action.payload.messageId)
  .type() === type

const isMessageText = (text: string) => (action: ReturnType<typeof wechatyDuck.actions.messageEvent>) => getWechaty(action.payload.wechatyId)
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

// const isChatieOA = (action: ReturnType<typeof wechatyDuck.actions.messageEvent>) => getWechaty(action.payload.wechatyId)
//   .Message.load(action.payload.messageId)
//   .from()!.id === CHATIE_OA_ID

const isDong      = (action: ReturnType<typeof wechatyDuck.actions.messageEvent>) => isMessageText(DONG)(action)

const isNotSelf   = (message: Message) => !message.self()

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

const toWechaty = <T extends { payload: PayloadWechatyId }>(action: T) => getWechaty(action.payload.wechatyId)
const toHa      = <T extends { payload: PayloadHaId      }>(action: T) => getHa(action.payload.haId)

export {
  milliAroundSeconds,
  toWechaty,
  toHa,
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
}
