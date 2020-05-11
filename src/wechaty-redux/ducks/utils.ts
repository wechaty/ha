/**
 * Wechaty Redux - Utils
 *
 * Huan https://github.com/huan May 2020
 */
import {
  from,
}                 from 'rxjs'
import {
  mapTo,
  filter,
  map,
}                 from 'rxjs/operators'

import {
  getWechaty,
}               from '../wechaty-redux'

import * as actions from './actions'
import { Message } from 'wechaty'

/**
 * Example: `pipe(mergeMap(toMessage$))`
 */
const toMessage$ = (action: ReturnType<typeof actions.messageEvent>) => {
  const wechaty = getWechaty(action.payload.wechatyId)
  const message = wechaty.Message.load(action.payload.messageId)
  return from(
    message.ready()
  ).pipe(
    mapTo(message),
  )
}

const toContact$ = (action: ReturnType<typeof actions.loginEvent>) => {
  const wechaty = getWechaty(action.payload.wechatyId)
  const contact = wechaty.Contact.load(action.payload.contactId)
  return from(
    contact.ready()
  ).pipe(
    mapTo(contact),
  )
}
const toContactPayload$ = (action: ReturnType<typeof actions.loginEvent>) => from(
  getWechaty(action.payload.wechatyId)
    .puppet.contactPayload(action.payload.contactId)
).pipe(
  map(payload => ({
    ...payload,
    wechatyId: action.payload.wechatyId,
  }))
)

const isTextMessage = (text?: string) => (message: Message) => (
  message.type() === Message.Type.Text
) && (
  text
    ? text === message.text()
    : true
)

const skipSelfMessage$ = (action: ReturnType<typeof actions.messageEvent>) => {
  // filter(utils.isMessageFromSelf(false)),
  const wechaty = getWechaty(action.payload.wechatyId)
  const message = wechaty.Message.load(action.payload.messageId)
  return from(message.ready()).pipe(
    filter(() => !message.self()),
    mapTo(action)
  )
}

export {
  toMessage$,
  toContact$,
  toContactPayload$,
  isTextMessage,
  skipSelfMessage$,
}
