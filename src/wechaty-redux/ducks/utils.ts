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
}                 from 'rxjs/operators'

import {
  getWechaty,
}               from '../wechaty-redux'

import * as actions from './actions'

/**
 * Example: `pipe(mergeMap(toMessage$))`
 */
const toMessage$ = (action: ReturnType<typeof actions.messageEvent>) => {
  const wechaty = getWechaty(action.payload.wechatyId)
  const message = wechaty.Message.load(action.payload.messageId)
  return from(message.ready()).pipe(
    mapTo(message),
  )
}

export {
  toMessage$,
}
