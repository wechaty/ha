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
}               from '../../redux/'

import {
  getWechaty,
}                 from '../wechaty-redux'

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
  mergeMap(action => {
    const wechaty = getWechaty(action.payload.wechatyId)
    return from(wechaty.say(action.payload.text)).pipe(
      mapTo(actions.sayAsync.success(wechaty, action.payload.id)),
      catchError(e => of(actions.sayAsync.failure(wechaty, action.payload.id, e))),
    )
  })
)

export {
  dingEpic,
  resetEpic,
  sayEpic,
}
