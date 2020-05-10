import {
  EMPTY,
}               from 'rxjs'

import {
  getWechaty,
}               from '../wechaty-redux/wechaty-redux'

import {
  State,
}               from './reducers'

import * as selectors from './selectors'

import {
  PayloadAllId,
}                   from './config'

const emitError$ = <T extends { payload: PayloadAllId }>(action: T, state: State) => (error: any) => {
  const wechaty = getWechaty(action.payload.wechatyId)
  const ha = selectors.getHAByWechatyId(state, wechaty.id)
  wechaty.emit('error', error)
  ha.emit('error', error)
  return EMPTY
}

export {
  emitError$,
}
