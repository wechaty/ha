import {
  isActionOf,
}                 from 'typesafe-actions'

import {
  interval,
  of,
  merge,
  from,
  Observable,
}                 from 'rxjs'
import {
  catchError,
  debounce,
  filter,
  map,
  mapTo,
  mergeMap,
  switchMap,
  takeUntil,
  ignoreElements,
  groupBy,
}                   from 'rxjs/operators'

import { Wechaty } from 'wechaty'

import {
  RootEpic,
  VoidEpic,
}               from '../'

import {
  actions as wechatyActions,
}                             from '../wechaty'

import * as actions     from './actions'
import * as operations  from './operations'
import * as selectors   from './selectors'

import {
  milliAroundSeconds,
}                     from './utils'

const DING_WAIT_MILLISECONDS  = milliAroundSeconds(60)
const RESET_WAIT_MILLISECONDS = milliAroundSeconds(300)

/**
 * Huan(202004):
 *  We are using `messageEvent` at here, not `heartbeatEvent` for reasons.
 *
 *  e.g.:
 *    `heartbeatEvent` is not suitable at here,
 *    because the hostie server will emit heartbeat no matter than WeChat protocol available or not.
 */
const takeUntilDong = <T>(wechaty: Wechaty, action$: ReturnType<RootEpic>) => takeUntil<T>(
  action$.pipe(
    filter(isActionOf(actions.dong)),
    filter(operations.belongsToWechaty(wechaty)),
  ),
)

const takeUntilLoginout = <T>(wechaty: Wechaty, action$: ReturnType<RootEpic>) => takeUntil<T>(
  action$.pipe(
    filter(isActionOf([
      wechatyActions.loginEvent,
      wechatyActions.logoutEvent,
    ])),
    filter(operations.belongsToWechaty(wechaty)),
  ),
)

/**
 * High Available Stream Entrence
 *  emit all messages that come from the logined wechaty(s)
 *
 * In:  RootAction
 * Out: wechatyActions.messageEvent groupBy wechatyId
 */
const wechatyMessage$$ = (action$: ReturnType<RootEpic>) => action$.pipe(
  filter(isActionOf(wechatyActions.loginEvent)),
  map(operations.toWechaty),

  /**
   * mergeMap instead of switchMap:
   *  there might be multiple Wechaty instance passed to here
   */
  mergeMap(wechaty => action$.pipe(
    filter(isActionOf(wechatyActions.messageEvent)),
    filter(operations.belongsToWechaty(wechaty)),
    filter(operations.isMessageFromSelf(false)),
    takeUntilLoginout(wechaty, action$),
  )),

  groupBy(action => action.payload.message.wechaty.id),
)

// https://itnext.io/typescript-extract-unpack-a-type-from-a-generic-baca7af14e51
type Extract<P> = P extends Observable<infer T> ? T : never;
type GroupedMessageByWechaty = Extract<ReturnType<typeof wechatyMessage$$>>

/**
 * In:  actions.ding
 * Out: void
 *
 * Side Effect: call contact.say(ding)
 */
const dingEvokerEpic: VoidEpic = (action$, state$) => action$.pipe(
  filter(isActionOf(actions.ding)),
  mergeMap(action => from(operations.sayDingTo(action.payload.contact)).pipe(
    catchError(operations.emitError$(action, state$.value.ha))
  )),
  ignoreElements(),
)

/**
 * In:  wechatyActions.messageEvent
 * Out: actions.dongHA
 */
const dongEmitterEpic: RootEpic = action$ => action$.pipe(
  filter(isActionOf(wechatyActions.messageEvent)),
  filter(operations.isMessageTypeText),
  filter(operations.isMessageTextDong),
  map(action => actions.dong(action.payload.message)),
)

/**
 * In: actions.dongHA
 * Out:
 *  actions.recoverWechaty
 *  actions.recoverHA
 */
const recoverWechatyEmitterEpic: RootEpic = (action$, state$) => action$.pipe(
  filter(isActionOf(actions.dong)),
  mergeMap(action => merge(
    // Recover Wechaty
    of(actions.recoverWechaty(action.payload.message.wechaty)),
    // Recover HA
    of(actions.recoverHA(selectors.getHA(
      state$.value.ha,
      action.payload.message.wechaty,
    ))).pipe(
      filter(_ => !selectors.getHAAvailable(
        state$.value.ha,
        action.payload.message.wechaty,
      ))
    ),
  )),
)

/**
 * In:  actions.failureWechaty
 * Out: actions.failureHA
 */
const failureHAEmitterEpic: RootEpic = (action$, state$) => action$.pipe(
  filter(isActionOf(actions.failureWechaty)),
  filter(action => !selectors.getHAAvailable(
    state$.value.ha,
    action.payload.wechaty,
  )),
  map(action => actions.failureHA(
    selectors.getHA(
      state$.value.ha,
      action.payload.wechaty,
    ),
  )),
)

/**
 * In:  wechatyMessage$
 * Out:
 *  wechatyActions.reset
 */
const resetEmitterPerWechaty$ = (
  action$         : ReturnType<RootEpic>,
  wechatyMessage$ : GroupedMessageByWechaty,
) => wechatyMessage$.pipe(
  debounce(() => interval(RESET_WAIT_MILLISECONDS)),
  switchMap(action => interval(RESET_WAIT_MILLISECONDS).pipe(
    mapTo(wechatyActions.reset(
      action.payload.message.wechaty,
      'HAWechaty/ha/epics.ts/resetEmitterEpicPerWechaty$(action)',
    )),
    takeUntilDong(action.payload.message.wechaty, action$),
    takeUntilLoginout(action.payload.message.wechaty, action$),
  )),
)

/**
 * In:  ha$
 * Out:
 *  ations.failureWechaty
 *  actions.ding
 */
const dingEmitterPerWechaty$ = (
  action$         : ReturnType<RootEpic>,
  wechatyMessage$ : GroupedMessageByWechaty,
) => wechatyMessage$.pipe(
  debounce(() => interval(DING_WAIT_MILLISECONDS)),
  switchMap(action => merge(
    of(actions.failureWechaty(action.payload.message.wechaty)),
    interval(DING_WAIT_MILLISECONDS).pipe(
      mapTo(actions.ding(
        operations.toChatieOA(action.payload.message.wechaty),
      )),
      takeUntilDong(action.payload.message.wechaty, action$),
      takeUntilLoginout(action.payload.message.wechaty, action$),
    )
  )),
)

/**
 * Main Epic at here:
 *
 *  Out:
 *    actions.failureWechaty
 *    actions.ding
 *
 *    wechatyActions.reset
 */
const mainEpic: RootEpic = action$ => wechatyMessage$$(action$).pipe(
  mergeMap(wechatyMessage$ => merge(
    dingEmitterPerWechaty$(action$, wechatyMessage$),
    resetEmitterPerWechaty$(action$, wechatyMessage$),
  )),
)

export {
  dingEvokerEpic,
  dongEmitterEpic,
  failureHAEmitterEpic,
  mainEpic,
  recoverWechatyEmitterEpic,
}
