/* eslint-disable sort-keys */
import {
  createAction,
}                       from 'typesafe-actions'
import {
  Wechaty,
  Contact,
}           from 'wechaty'

import { HAWechaty } from '../../ha-wechaty'

import * as types from './types'

const prepareHA         = (ha: HAWechaty)     => ({ haId: ha.id })
const prepareWechaty    = (wechatyId: string) => ({ wechatyId })
// const prepareMessage    = (message: Message)  => ({ wechatyId: message.wechaty.id, messageId: message.id })
const prepareContact    = (contact: Contact)  => ({ wechatyId: contact.wechaty.id, contactId: contact.id })
const prepareHAWechaty  = (ha: HAWechaty, wechaty: Wechaty)  => ({ haId: ha.id, wechatyId: wechaty.id })

const prepareDong = (wechatyId: string, messageId: string) => ({ messageId, wechatyId })

/**
 * Actions
 */
const addWechaty = createAction(types.WECHATY_ADD, prepareHAWechaty)()
const delWechaty = createAction(types.WECHATY_DEL, prepareHAWechaty)()

const failureHA = createAction(types.HA_FAILURE, prepareHA)()
const recoverHA = createAction(types.HA_RECOVER, prepareHA)()

const failureWechaty = createAction(types.WECHATY_FAILURE, prepareWechaty)()
const recoverWechaty = createAction(types.WECHATY_RECOVER, prepareWechaty)()

const ding = createAction(types.DING, prepareContact)()
const dong = createAction(types.DONG, prepareDong)()

export {
  addWechaty,
  delWechaty,

  ding,
  dong,

  failureHA,
  recoverHA,

  failureWechaty,
  recoverWechaty,
}
