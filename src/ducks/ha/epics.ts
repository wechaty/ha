import {
  isActionOf,
  RootState,
  RootAction,
  RootService,
}                 from 'typesafe-actions'

import {
  Contact,
  Message,
  Wechaty,
}             from 'wechaty'

import {
  ActionsObservable,
  combineEpics,
  ofType,
  Epic,
  // StateObservable,
}                     from 'redux-observable'

import {
  interval,
  fromEvent,
  of,
  merge,
  pipe,
}                 from 'rxjs'
import {
  catchError,
  delay,
  filter,
  ignoreElements,
  map,
  mapTo,
  mergeMap,
  retryWhen,
  repeat,
  repeatWhen,
  switchMap,
  startWith,
  takeUntil,
  tap,
  throttle,
  timeout,
}                   from 'rxjs/operators'

import { HAWechaty } from '../../'
import {
  log,
  CHATIE_OA_ID,
}                 from '../../config'

import {
  wechatyActions,
  wechatyOperations,
}                     from '../wechaty'

import * as actions     from './actions'
import * as operations  from './operations'

type DucksEpic = Epic<
  RootAction,
  RootAction,
  RootState,
  RootService,
>
type HADucksEpic = (ha: HAWechaty) => DucksEpic

const toHaDongAction = (action: ReturnType<typeof actions.message>) => actions.haDong(action.payload.message.wechaty.id)

const onMessageHaDongEpic = (
  action$: ActionsObservable<Action>,
) => action$.pipe(
  filter(actions.message.match),
  filter(isDong),
  filter(isChatieOA),
  map(toHaDongAction),
)

const sixtySecondsInterval = () => interval(60 * 1000)
const fifteenSecondsInterval = () => interval(15 * 1000)
const fifteenSecondsDelay = () => delay(15 * 1000)
const sayDing = (contact: Contact) => contact.say('ding')

const toChatieOA = (action: ReturnType<typeof actions.message>) => action.payload.message.wechaty.Contact.load(CHATIE_OA_ID)

const onMessageEpic = (
  action$: ActionsObservable<Action>,
  // states$: StateObservable<types.State>,
) => action$.pipe(
  filter(actions.message.match),
  throttle(sixtySecondsInterval),
  mergeMap(action => fifteenSecondsInterval()
    .pipe(
      mapTo(action),
      tap(sendHaDing),
      mergeMap(recvHaDong),
    )
  )
)

const recvHaDong = (
  action$: ActionsObservable<RootAction>,
  // states$: StateObservable<types.State>,
) => action$.pipe(
  filter(actions.haDong.match),
  mergeMap(action => of(action).pipe(
    timeout(60 * 1000),
    catchError(() => of(actions.haDingTimeout(action.payload))),
    takeUntilDongOrOff(action$),
  )),
)


function haDing (
  this: HAWechaty,
  action$: ActionsObservable<Action>,
) {
  action$.
  this.wechatyList
    .map(toChatieOA)
    .forEach(sayDing)
}

const mock = {} as any

const isMessageEvent = isActionOf(wechatyActions.messageEvent)
const isDong = (action: ReturnType<typeof wechatyActions.messageEvent>) => /dong/i.test(action.payload.message.text())

const dongEpic: HADucksEpic = (ha: HAWechaty) => (action$) => action$.pipe(
  filter(isMessageEvent),
  filter(isDong),
  map(action => actions.dong(ha, action.payload.message))
)

type PayloadWechaty = { payload: { wechaty: Wechaty } }
type PayloadMessage = { payload: { message: Message } }

const toWechaty =                                  (action: PayloadWechaty) => action.payload.wechaty
const isMessageFromWechaty = (wechaty: Wechaty) => (action: PayloadMessage) => action.payload.message.wechaty.id === wechaty.id

const dingTimeoutEpic: HADucksEpic = ha => action$ => action$.pipe(
  filter(isActionOf(wechatyActions.loginEvent)),
  map(toWechaty),
  switchMap(wechaty => action$.pipe(
    filter(isActionOf(wechatyActions.messageEvent)),
    tap(action => console.log(action)),
    filter(isMessageFromWechaty(wechaty)),
    // tap(action => console.log(action)),
  )),
  mapTo(wechatyActions.turnOnSwitch(true))
  // map(action => action.type + '33'),
  // switchMap(action => ),
)

const DING_WAIT_SECONDS = 60
const RESET_WAIT_SECONDS = 300

const intervalAroundSeconds = (seconds: number) => {
  const factor = 1 / 5
  const ms = seconds * 1000

  const base = ms * (1 - factor)
  const vari = ms * factor * 2 * Math.random()

  const finalTime = base + Math.round(vari)
  return interval(finalTime)
}

const takeUntilRecover = (action$: ActionsObservable<RootAction>) => takeUntil(
  merge(
    action$.pipe(filter(isActionOf(wechatyActions.messageEvent))),
    action$.pipe(filter(isActionOf(wechatyActions.logoutEvent))),
  )
)

const resetEpic: DucksEpic = (action$) => action$.pipe(
  filter(isActionOf(wechatyActions.loginEvent)),

  switchMap(_ => action$.pipe(
    filter(isActionOf(wechatyActions.messageEvent)),
    throttle(() => intervalAroundSeconds(RESET_WAIT_SECONDS)),
    switchMap(action => intervalAroundSeconds(RESET_WAIT_SECONDS).pipe(
      mapTo(wechatyActions.reset(action.payload.message.wechaty, 'RxJS')),
    )),
    // takeUntilRecover(action$),
  )),
)

const dingEpic: DucksEpic = (action$) => action$.pipe(
  filter(isActionOf(wechatyActions.loginEvent)),

  switchMap(_ => action$.pipe(
    filter(isActionOf(wechatyActions.messageEvent)),
    throttle(() => intervalAroundSeconds(DING_WAIT_SECONDS)),
    switchMap(action => intervalAroundSeconds(DING_WAIT_SECONDS).pipe(
      mapTo(actions.dingAsync.request(action.payload.message.wechaty.Contact.load(CHATIE_OA_ID)))),
    )),
    takeUntilRecover(action$),
  )),
)

export default resetEpic
