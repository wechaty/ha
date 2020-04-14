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
  CHATIE_OA_ID,
  DING,
  DONG,
}                 from '../../config'

import {
  RootEpic,
}               from '../'

import {
  wechatyActions,
  wechatyOperations,
}                     from '../wechaty'

import * as actions     from './actions'
import * as operations  from './operations'

const ASYNC_TIMEOUT_SECONDS = 15

const isFromOf = (contact: Contact) => (action: PayloadMessage) => action.payload.message.from()!.id === contact.id

const dongWorkerEpic: RootEpic = action$ => action$.pipe(
  filter(isActionOf(wechatyActions.messageEvent)),
  filter(isTextOf(DONG)),
  map(action => actions.dongHA(action.payload.message)),
)

const dingHAAsyncEpic: RootEpic = action$ => action$.pipe(
  filter(isActionOf(actions.dingHAAsync.request)),
  // throttle(() => interval(1000)),  // execute every ding ha request
  mergeMap(action => from(action.payload.contact.say(DING)).pipe(
    mergeMap(_ => action$.pipe(
      filter(isActionOf(actions.dongHA)),
      filter(isFromOf(action.payload.contact)),
      mapTo(actions.dingHAAsync.success(action.payload)),
    )),
    timeout(aroundSeconds(ASYNC_TIMEOUT_SECONDS)),
    catchError(err => of(actions.dingHAAsync.failure(err))),
  ))
)

const isTextOf = (text: string) => (action: ReturnType<typeof wechatyActions.messageEvent>) => action.payload.message.text() === text

type PayloadWechaty = { payload: { wechaty: Wechaty } }
type PayloadMessage = { payload: { message: Message } }

const toWechaty   =                       (action: PayloadWechaty) => action.payload.wechaty
const isMessageOf = (wechaty: Wechaty) => (action: PayloadMessage) => action.payload.message.wechaty.id === wechaty.id

const DING_WAIT_SECONDS = 60
const RESET_WAIT_SECONDS = 300

/**
 * Increase or Decrease a random time on the target seconds
 * based on the `factor`
 * @param seconds base number of target seconds
 */
const aroundSeconds = (seconds: number) => {
  const factor = 1 / 7
  const ms = seconds * 1000

  const base = ms * (1 - factor)
  const vari = ms * factor * 2 * Math.random()

  const finalTime = base + Math.round(vari)
  return finalTime
}

const takeUntilRecover = <T extends RootAction>(action$: ActionsObservable<T>) => takeUntil<T>(
  merge(
    action$.pipe(filter(isActionOf(wechatyActions.messageEvent))),
    action$.pipe(filter(isActionOf(wechatyActions.logoutEvent))),
  )
)

const resetMonitorEpic: RootEpic = (action$) => action$.pipe(
  filter(isActionOf(wechatyActions.loginEvent)),
  map(toWechaty),
  switchMap(wechaty => action$.pipe(
    filter(isActionOf(wechatyActions.messageEvent)),
    filter(isMessageOf(wechaty)),

    throttle(() => interval(aroundSeconds(RESET_WAIT_SECONDS))),
    switchMap(action => interval(aroundSeconds(RESET_WAIT_SECONDS)).pipe(
      mapTo(wechatyActions.resetAsync.request({
        data: 'RxJS',
        wechaty: action.payload.message.wechaty,
      })),
      takeUntilRecover(action$),
    )),
  )),
)

const dingMonitorEpic: RootEpic = (action$) => action$.pipe(
  filter(isActionOf(wechatyActions.loginEvent)),
  map(toWechaty),
  switchMap(wechaty => action$.pipe(
    filter(isActionOf(wechatyActions.messageEvent)),
    filter(isMessageOf(wechaty)),

    throttle(() => interval(aroundSeconds(DING_WAIT_SECONDS))),
    switchMap(action => interval(aroundSeconds(DING_WAIT_SECONDS)).pipe(
      mapTo(actions.dingHAAsync.request({
        contact: action.payload.message.wechaty.Contact.load(CHATIE_OA_ID),
      })),
    )),
    takeUntilRecover(action$),
  )),
)

export default combineEpics(
  dingMonitorEpic,
  resetMonitorEpic,
  dongWorkerEpic,
  dingHAAsyncEpic,
)
