import {
  isActionOf,
}                 from 'typesafe-actions'

import {
  filter,
  mergeMap,
}                   from 'rxjs/operators'

import * as actions from './actions'

import {
  RootEpic,
}               from '../../redux/'

import * as operations from './operations'

const dingEpic: RootEpic = actions$ => actions$.pipe(
  filter(isActionOf(actions.ding)),
  mergeMap(operations.ding$),
)

const resetEpic: RootEpic = actions$ => actions$.pipe(
  filter(isActionOf(actions.reset)),
  mergeMap(operations.reset$),
)

const sayEpic: RootEpic = actions$ => actions$.pipe(
  filter(isActionOf(actions.sayAsync.request)),
  mergeMap(operations.say$),
)

export {
  dingEpic,
  resetEpic,
  sayEpic,
}
