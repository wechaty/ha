import {
  isActionOf,
}                 from 'typesafe-actions'

import {
  filter,
  mergeMap,
  map,
}                   from 'rxjs/operators'

import {
  RootEpic,
}               from '../../redux'

import * as actions     from './actions'
import * as rxAsync     from './rx-async'
import * as utils       from './utils'

const dingEpic: RootEpic = actions$ => actions$.pipe(
  filter(isActionOf(actions.ding)),
  mergeMap(rxAsync.ding$),
)

const resetEpic: RootEpic = actions$ => actions$.pipe(
  filter(isActionOf(actions.reset)),
  mergeMap(rxAsync.reset$),
)

const sayEpic: RootEpic = actions$ => actions$.pipe(
  filter(isActionOf(actions.sayAsync.request)),
  mergeMap(rxAsync.say$),
)

const loginEpic: RootEpic = actions$ => actions$.pipe(
  filter(isActionOf(actions.loginEvent)),
  mergeMap(utils.toContactPayload$),
  map(payload => actions.loginUser(payload)),
)

export {
  dingEpic,
  resetEpic,
  sayEpic,
  loginEpic,
}
