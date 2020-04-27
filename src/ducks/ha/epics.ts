import {
  isActionOf,
  RootAction,
}                 from 'typesafe-actions'

import {
  ActionsObservable,
}                     from 'redux-observable'

import {
  interval,
  of,
  merge,
  from,
}                 from 'rxjs'
import {
  catchError,
  debounce,
  filter,
  map,
  mapTo,
  mergeMap,
  tap,
  switchMap,
  takeUntil,
  throttle,
  ignoreElements,
}                   from 'rxjs/operators'

import {
  DING,
  DONG,
}                 from '../../config'

import {
  RootEpic,
}               from '../'

import {
  actions as wechatyActions,
}                             from '../wechaty'

import actions     from './actions'
import operations  from './operations'

import {
  aroundSeconds,
}                     from './utils'

const ASYNC_TIMEOUT_SECONDS = 15
const DING_WAIT_SECONDS     = 60
const RESET_WAIT_SECONDS    = 300

const dongEmitterEpic: RootEpic = action$ => action$.pipe(
  filter(isActionOf(wechatyActions.messageEvent)),
  filter(operations.isTextOf(DONG)),
  map(action => actions.dongHA(action.payload.message)),
)

const dingHAEpic: RootEpic = action$ => action$.pipe(
  filter(isActionOf(actions.dingHA)),
  // throttle(() => interval(1000)),  // execute every ding ha request
  mergeMap(action => from(action.payload.contact.say(DING)).pipe(
    catchError(error => of(action.payload.contact.wechaty.emit('error', error))),
  )),
  ignoreElements(),
)

const takeUntilRecover = <T extends RootAction>(action$: ActionsObservable<T>) => takeUntil<T>(
  merge(
    action$.pipe(filter(isActionOf(wechatyActions.heartbeatEvent))),
    action$.pipe(filter(isActionOf(wechatyActions.logoutEvent))),
  )
)

const resetEmitterEpic: RootEpic = (action$) => action$.pipe(
  filter(isActionOf(wechatyActions.loginEvent)),
  map(operations.toWechaty),
  switchMap(wechaty => action$.pipe(
    filter(isActionOf(wechatyActions.messageEvent)),
    filter(operations.isMessageOf(wechaty)),

    throttle(() => interval(aroundSeconds(RESET_WAIT_SECONDS))),
    switchMap(action => interval(aroundSeconds(RESET_WAIT_SECONDS)).pipe(
      mapTo(wechatyActions.resetAsync.request({
        data    : 'HAWechaty/ha/epics/resetEmitterEpic(action)',
        wechaty : action.payload.message.wechaty,
      })),
      takeUntilRecover(action$),
    )),
  )),
)

const dingEmitterEpic: RootEpic = (action$) => action$.pipe(
  filter(isActionOf(wechatyActions.loginEvent)),
  map(operations.toWechaty),
  switchMap(wechaty => action$.pipe(
    filter(isActionOf(wechatyActions.messageEvent)),
    filter(operations.isMessageOf(wechaty)),

    throttle(() => interval(aroundSeconds(DING_WAIT_SECONDS))),
    switchMap(action => interval(aroundSeconds(DING_WAIT_SECONDS)).pipe(
      mapTo(actions.dingHA(
        operations.toChatieOA(action.payload.message.wechaty),
      )),
    )),
    takeUntilRecover(action$),
  )),
)

export default {
  dingEmitterEpic,
  dingHAAsyncEpic: dingHAEpic,
  dongEmitterEpic,
  resetEmitterEpic,
}
