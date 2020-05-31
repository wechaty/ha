import {
  createAction,
}                       from 'typesafe-actions'

import * as types from './types'

const prepareHA         = (haId: string)      => ({ haId })
const prepareWechaty    = (wechatyId: string) => ({ wechatyId })

const prepareContact    = (wechatyId: string, contactId: string)  => ({ contactId, wechatyId })
const prepareHAWechaty  = (haId: string, wechatyId: string)  => ({ haId, wechatyId })

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

const noop = createAction(types.NOOP)()

export {
  addWechaty,
  delWechaty,

  ding,
  dong,

  failureHA,
  recoverHA,

  failureWechaty,
  recoverWechaty,

  noop,
}
