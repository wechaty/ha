import {
  createAction,
  createAsyncAction,
}                       from 'typesafe-actions'
import {
  Contact,
  Wechaty,
  Message,
}           from 'wechaty'

import { HAWechaty } from '../../'

import types from './types'

const prepareHA         = (ha: HAWechaty)     => ({ ha })
const prepareWechaty    = (wechaty: Wechaty)  => ({ wechaty })
const prepareMessage    = (message: Message)  => ({ message })
const prepareHAWechaty  = (ha: HAWechaty, wechaty: Wechaty)  => ({ ha, wechaty })

const addWechaty = createAction(types.WECHATY_ADD, prepareHAWechaty)()
const delWechaty = createAction(types.WECHATY_DEL, prepareHAWechaty)()

const failHA    = createAction(types.HA_FAIL,    prepareHA)()
const recoverHA = createAction(types.HA_RECOVER, prepareHA)()

const failWechaty    = createAction(types.WECHATY_FAIL,    prepareWechaty)()
const recoverWechaty = createAction(types.WECHATY_RECOVER, prepareWechaty)()

const dongHA = createAction(types.HA_DONG, prepareMessage)()

/**
 * Async
 */
const dingHAAsync = createAsyncAction(
  types.HA_DING_REQUEST,
  types.HA_DING_SUCCESS,
  types.HA_DING_FAILURE,
)<{ contact: Contact }, { contact: Contact }, Error>()

export default {
  addWechaty,
  delWechaty,
  failHA,
  recoverHA,
  ...{
    failWechaty,
    recoverWechaty,
  },
  dingHAAsync,
  dongHA,
}
