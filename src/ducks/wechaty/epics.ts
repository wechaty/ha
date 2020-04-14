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

import actions from './actions'

import {
  RootEpic,
}               from '../'

const dingEpic: RootEpic = actions$ => actions$.pipe(
  filter(isActionOf(actions.dingAsync.request)),
  tap(action => action.payload.wechaty.ding(action.payload.data)),
  ignoreElements(),
)

const resetEpic: RootEpic = actions$ => actions$.pipe(
  filter(isActionOf(actions.resetAsync.request)),
  mergeMap(action => from(action.payload.wechaty.reset(action.payload.data)).pipe(
    mapTo(actions.resetAsync.success()),
    catchError(e => of(actions.resetAsync.failure(e))),
  ))
)

const sayEpic: RootEpic = actions$ => actions$.pipe(
  filter(isActionOf(actions.sayAsync.request)),
  mergeMap(action => from(action.payload.sayable.say(action.payload.text)).pipe(
    mapTo(actions.sayAsync.success()),
    catchError(e => of(actions.sayAsync.failure(e))),
  ))
)

export default {
  dingEpic,
  resetEpic,
  sayEpic,
}
