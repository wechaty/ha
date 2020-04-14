import {
  isActionOf,
  RootAction,
}                 from 'typesafe-actions'

import {
  Contact,
  Message,
  Wechaty,
}             from 'wechaty'

import {
  ActionsObservable,
  combineEpics,
}                     from 'redux-observable'

import {
  interval,
  of,
  merge,
  from,
}                 from 'rxjs'
import {
  take,
  catchError,
  filter,
  map,
  mapTo,
  mergeMap,
  switchMap,
  takeUntil,
  throttle,
  timeout,
}                   from 'rxjs/operators'

import {
  DING,
  DONG,
}                 from '../../config'

import {
  RootEpic,
}               from '../'

import {
  wechatyActions,
}                     from '../wechaty'

import * as actions     from './actions'
import * as operations  from './operations'

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

const dingHAAsyncEpic: RootEpic = action$ => action$.pipe(
  filter(isActionOf(actions.dingHAAsync.request)),
  // throttle(() => interval(1000)),  // execute every ding ha request
  mergeMap(action => from(action.payload.contact.say(DING)).pipe(
    mergeMap(_ => action$.pipe(
      filter(isActionOf(actions.dongHA)),
      take(1),
      filter(operations.isFromOf(action.payload.contact)),
      mapTo(actions.dingHAAsync.success(action.payload)),
    )),
    timeout(aroundSeconds(ASYNC_TIMEOUT_SECONDS)),
    catchError(err => of(actions.dingHAAsync.failure(err))),
  ))
)

const takeUntilRecover = <T extends RootAction>(action$: ActionsObservable<T>) => takeUntil<T>(
  merge(
    action$.pipe(filter(isActionOf(wechatyActions.messageEvent))),
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
      mapTo(actions.dingHAAsync.request({
        contact: operations.toChatieOA(action.payload.message.wechaty),
      })),
    )),
    takeUntilRecover(action$),
  )),
)

export default combineEpics(
  dingEmitterEpic,
  resetEmitterEpic,
  dongEmitterEpic,
  dingHAAsyncEpic,
)
