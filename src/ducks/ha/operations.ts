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

export const isSwitchSuccess = (action: ReturnType<typeof wechatyActions (status: true | 'pending') => status === true

export const isChatieOA  = (action: ReturnType<typeof wechatyActions.messageEvent>) => action.payload.message.from()!.id === CHATIE_OA_ID
export const isDong      = (action: ReturnType<typeof wechatyActions.messageEvent>) => action.payload.message.text() === DONG

export const isNotSelf = (message: Message) => !message.self()

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

export const setUnavailable = (wechaty: Wechaty) => () => {
  log.verbose('HAWechaty', 'ducks/ha/operations setUnavailable(%s)', wechaty)
  availableState[wechaty.id] = false
}
const available = (wechaty: Wechaty) => () => (availableState[wechaty.id] = true)
