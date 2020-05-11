/**
 * Command Interface of the CQRS Pattern
 *  Command Query Responsibility Segregation (CQRS)
 *
 * Huan https://github.com/huan May 2020
 */
import {
  of,
}                 from 'rxjs'
import {
  ignoreElements,
  catchError,
  mapTo,
}                 from 'rxjs/operators'

import {
  getWechaty,
}                 from '../wechaty-redux'

import * as actions from './actions'

const ding$ = (action: ReturnType<typeof actions.ding>) => of(
  getWechaty(action.payload.wechatyId)
    .ding(action.payload.data)
).pipe(
  ignoreElements(),
  catchError(e => of(
    actions.errorEvent(
      action.payload.wechatyId,
      { data: String(e) },
    )
  )),
)

const reset$ = (action: ReturnType<typeof actions.reset>) => of(
  getWechaty(action.payload.wechatyId)
    .reset(action.payload.data)
).pipe(
  ignoreElements(),
  catchError(e => of(
    actions.errorEvent(
      action.payload.wechatyId,
      { data: String(e) },
    )
  )),
)

const say$ = (action: ReturnType<typeof actions.sayAsync.request>) => of(
  getWechaty(action.payload.wechatyId)
    .say(action.payload.text)
).pipe(
  mapTo(actions.sayAsync.success(action.payload.wechatyId, action.payload.id)),
  catchError(e => of(
    actions.sayAsync.failure(
      action.payload.wechatyId,
      action.payload.id,
      e,
    )
  ))
)

export {
  ding$,
  reset$,
  say$,
}
