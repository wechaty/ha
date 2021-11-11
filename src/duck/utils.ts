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
import type {
  Contact,
  Message,
}                   from 'wechaty'
import * as PUPPET  from 'wechaty-puppet'
import {
  getWechaty,
  Duck as wechatyDuck,
}                       from 'wechaty-redux'

import {
  getHa,
}                   from '../mod.js'
import {
  CHATIE_OA_ID,
  DONG,
  log,
}             from '../config.js'

// import {
//   PayloadMessageId,
// }                   from './schema.js'

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
  factor = 1 / 5,
) => {
  const ms = seconds * 1000

  const base = ms * (1 - factor)
  const vari = ms * factor * 2 * Math.random()

  const finalTime = base + Math.round(vari)
  return finalTime
}

const isFromContact = (contact: Contact) => async <T extends { payload: PayloadMessageId }>(action: T) => {
  const message = await getWechaty(action.payload.wechatyId)
    .Message.find({ id: action.payload.messageId })
  if (message) {
    return message.talker().id === contact.id
  }
  return false
}

// TODO
const isMessageFromSelf = (isSelf = true) => async <T extends { payload: PayloadMessageId }> (action: T) => {
  const message = await getWechaty(action.payload.wechatyId)
    .Message.find({ id: action.payload.messageId })
  if (message) {
    return message.self() === isSelf
  }
  return false
}

const isMessageType = (type: PUPPET.type.Message) => async (action: ReturnType<typeof wechatyDuck.actions.messageEvent>) => {
  const message = await getWechaty(action.payload.wechatyId)
    .Message.find({ id: action.payload.messageId })
  if (message) {
    return message.type() === type
  }
  return false
}

const isMessageText = (text: string) => async (action: ReturnType<typeof wechatyDuck.actions.messageEvent>) => {
  const message = await getWechaty(action.payload.wechatyId)
    .Message.find({ id: action.payload.messageId })
  if (message) {
    return message.text() === text
  }
  return false
}

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

const isMessageTypeText = isMessageType(PUPPET.type.Message.Text)
const isMessageTextDong = isMessageText(DONG)

// const isChatieOA = (action: ReturnType<typeof wechatyDuck.actions.messageEvent>) => getWechaty(action.payload.wechatyId)
//   .Message.load(action.payload.messageId)
//   .from()!.id === CHATIE_OA_ID

const isDong      = (action: ReturnType<typeof wechatyDuck.actions.messageEvent>) => isMessageText(DONG)(action)

const isNotSelf   = (message: Message) => !message.self()

const toChatieOA = async (wechatyId: string): Promise<Contact> => {
  const wechaty = getWechaty(wechatyId)
  const contact = await wechaty.Contact.find({ id: CHATIE_OA_ID })
  if (contact) {
    return contact
  }

  log.error('HAWechaty', 'toChatieOA(%s) find OA failed.', wechaty)
  throw new Error([
    '',
    'In order to use HAWechaty, we need to follow WeChat Official Account "chatieio" first.',
    'See #1: https://github.com/wechaty/HAWechaty/issues/1',
    '',
  ].join('\n'))
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
  isFromContact,
  isMessageFromSelf,
  isMessageText,
  isMessageType,
  isNotSelf,
  toChatieOA,

  isMessageTextDong,
  isMessageTypeText,
}
