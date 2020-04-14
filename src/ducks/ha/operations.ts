import {
  Contact,
  Message,
  Wechaty,
}             from 'wechaty'

import {
  CHATIE_OA_ID,
  DING,
  DONG,
  log,
}             from '../../config'

import {
  wechatyActions,
}                   from '../wechaty/'

// import * as actions from './actions'

type PayloadWechaty = { payload: { wechaty: Wechaty } }
type PayloadMessage = { payload: { message: Message } }

export const isFromOf    = (contact: Contact) => (action: PayloadMessage) => action.payload.message.from()!.id === contact.id
export const isMessageOf = (wechaty: Wechaty) => (action: PayloadMessage) => action.payload.message.wechaty.id === wechaty.id
export const isTextOf    = (text: string)     => (action: ReturnType<typeof wechatyActions.messageEvent>) => action.payload.message.text() === text
export const toWechaty   =                       (action: PayloadWechaty) => action.payload.wechaty

export const isChatieOA  = (action: ReturnType<typeof wechatyActions.messageEvent>) => isFromOf(toChatieOA(action.payload.message.wechaty))(action)
export const isDong      = (action: ReturnType<typeof wechatyActions.messageEvent>) => isTextOf(DONG)(action)

export const isNotSelf   = (message: Message) => !message.self()

export const toChatieOA = (wechaty: Wechaty): Contact => {
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

export const dingChatie = (wechaty: Wechaty) => () => toChatieOA(wechaty).say(DING)
  .catch(e => log.error('HAWechaty', 'heartbeat$() dingChatie() say() rejection: %s', e))
