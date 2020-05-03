import {
  createAction,
}                       from 'typesafe-actions'
import {
  Wechaty,
  Message,
  Contact,
}           from 'wechaty'

import { HAWechaty } from '../../'

import * as types from './types'

const prepareHA         = (ha: HAWechaty)     => ({ ha })
const prepareWechaty    = (wechaty: Wechaty)  => ({ wechaty })
const prepareMessage    = (message: Message)  => ({ message })
const prepareContact    = (contact: Contact)  => ({ contact })
const prepareHAWechaty  = (ha: HAWechaty, wechaty: Wechaty)  => ({ ha, wechaty })

const addWechaty = createAction(types.WECHATY_ADD, prepareHAWechaty)()
const delWechaty = createAction(types.WECHATY_DEL, prepareHAWechaty)()

const failureHA = createAction(types.HA_FAILURE, prepareHA)()
const recoverHA = createAction(types.HA_RECOVER, prepareHA)()

const failureWechaty = createAction(types.WECHATY_FAILURE, prepareWechaty)()
const recoverWechaty = createAction(types.WECHATY_RECOVER, prepareWechaty)()

const ding = createAction(types.DING, prepareContact)()
const dong = createAction(types.DONG, prepareMessage)()

export default {
  addWechaty,
  delWechaty,

  ding,
  dong,

  failureHA,
  recoverHA,
  ...{
    failureWechaty,
    recoverWechaty,
  },
}
