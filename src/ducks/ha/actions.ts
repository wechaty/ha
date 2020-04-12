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

import * as types from './types'

const prepareHA         = (ha: HAWechaty)     => ({ ha })
const prepareWechaty    = (wechaty: Wechaty)  => ({ wechaty })
const prepareMessage    = (message: Message)  => ({ message })
const prepareHAWechaty  = (ha: HAWechaty, wechaty: Wechaty)  => ({ ha, wechaty })

export const addWechaty = createAction(types.WECHATY_ADD, prepareHAWechaty)()
export const delWechaty = createAction(types.WECHATY_DEL, prepareHAWechaty)()

export const failHA    = createAction(types.HA_FAIL,    prepareHA)()
export const recoverHA = createAction(types.HA_RECOVER, prepareHA)()

export const failWechaty    = createAction(types.WECHATY_FAIL,    prepareWechaty)()
export const recoverWechaty = createAction(types.WECHATY_RECOVER, prepareWechaty)()

/**
 * Async
 */
export const dingAsync = createAsyncAction(
  types.HA_DING_REQUEST,
  types.HA_DING_SUCCESS,
  types.HA_DING_FAILURE,
)<Contact, Contact, Error>()
