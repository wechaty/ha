import {
  isActionOf,
}                 from 'typesafe-actions'

import {
  of,
  from,
}                 from 'rxjs'
import {
  catchError,
  filter,
  ignoreElements,
  mapTo,
  mergeMap,
  tap,
}                   from 'rxjs/operators'

// import {
//   Contact,
//   Message,
//   Wechaty,
// }             from 'wechaty'

import * as actions from './actions'

import {
  RootEpic,
  VoidEpic,
}               from '../'

import {
  getWechaty,
}                 from '../../wechaty-redux'

const dingEpic: VoidEpic = actions$ => actions$.pipe(
  filter(isActionOf(actions.ding)),
  tap(action => getWechaty(action.payload.wechatyId).ding(action.payload.data)),
  ignoreElements(),
)

const resetEpic: VoidEpic = actions$ => actions$.pipe(
  filter(isActionOf(actions.reset)),
  mergeMap(action => from(getWechaty(action.payload.wechatyId).reset(action.payload.data)).pipe(
    // catchError(e => of(actions.resetAsync.failure(e))),
    ignoreElements(),
  ))
)

const sayEpic: RootEpic = actions$ => actions$.pipe(
  filter(isActionOf(actions.sayAsync.request)),
  mergeMap(action => from(getWechaty(action.payload.wechatyId).say(action.payload.text)).pipe(
    mapTo(actions.sayAsync.success()),
    catchError(e => of(actions.sayAsync.failure(e))),
  ))
)

export {
  dingEpic,
  resetEpic,
  sayEpic,
}
