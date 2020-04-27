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
  switchMap,
  takeUntil,
  ignoreElements,
}                   from 'rxjs/operators'

import {
  RootEpic,
}               from '../'

import {
  actions as wechatyActions,
}                             from '../wechaty'

import actions     from './actions'
import operations  from './operations'
import selectors   from './selectors'

import {
  milliAroundSeconds,
}                     from './utils'

const DING_WAIT_MILLISECONDS  = milliAroundSeconds(60)
const RESET_WAIT_MILLISECONDS = milliAroundSeconds(300)

/**
 * High Available Stream Entrence
 *  emit all messages that come from the logined wechaty(s)
 *
 * In:  RootAction
 * Out: wechatyActions.messageEvent
 */
const ha$ = (action$: ReturnType<RootEpic>) => action$.pipe(
  filter(isActionOf(wechatyActions.loginEvent)),
  map(operations.toWechaty),
  /**
   * mergeMap instead of switchMap:
   *  there might be multiple Wechaty instance passed to here
   */
  mergeMap(wechaty => action$.pipe(
    filter(isActionOf(wechatyActions.messageEvent)),
    filter(operations.isMessageFrom(wechaty)),
    filter(operations.isMessageFromSelf(false)),
  ))
)

const takeUntilRecover = <T extends RootAction>(action$: ActionsObservable<T>) => takeUntil<T>(
  merge(
    /**
     * Huan(202004):
     *  We are using `messageEvent` at here, not `heartbeatEvent` for reasons.
     *
     *  e.g.:
     *    `heartbeatEvent` is not suitable at here,
     *    because the hostie server will emit heartbeat no matter than WeChat protocol available or not.
     */
    // action$.pipe(filter(isActionOf(wechatyActions.messageEvent))),
    action$.pipe(filter(isActionOf(actions.dongHA))),
    action$.pipe(filter(isActionOf(wechatyActions.logoutEvent))),
  )
)

/**
 * In:  wechatyActions.messageEvent
 * Out: actions.dongHA
 */
const dongEmitterEpic: RootEpic = action$ => action$.pipe(
  filter(isActionOf(wechatyActions.messageEvent)),
  filter(operations.isMessageTypeText),
  filter(operations.isMessageTextDong),
  map(action => actions.dongHA(action.payload.message)),
)

/**
 * In: actions.dongHA
 * Out:
 *  actions.recoverWechaty
 *  actions.recoverHA
 */
const recoverWechatyEmitterEpic: RootEpic = (action$, state$) => action$.pipe(
  filter(isActionOf(actions.dongHA)),
  mergeMap(action => merge(
    of(actions.recoverHA(selectors.getHA(
      state$.value.ha,
      action.payload.message.wechaty,
    ))).pipe(
      filter(_ => !selectors.getHAAvailable(
        state$.value.ha,
        action.payload.message.wechaty,
      ))
    ),
    of(actions.recoverWechaty(action.payload.message.wechaty)),
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
 * In:  actions.dingHA
 * Out: void
 *
 * Side Effect: call contact.say(ding)
 */
const performDingEpic: RootEpic = action$ => action$.pipe(
  filter(isActionOf(actions.dingHA)),
  // throttle(() => interval(1000)),  // execute every ding ha request
  mergeMap(action => from(operations.sayDing(action.payload.contact)).pipe(
    catchError(error => of(action.payload.contact.wechaty.emit('error', error))),
    ignoreElements(),
  )),
)

/**
 * In:  ha$
 * Out:
 *  wechatyActions.reset
 */
const resetEmitterEpic: RootEpic = action$ => ha$(action$).pipe(
  debounce(() => interval(RESET_WAIT_MILLISECONDS)),
  switchMap(action => interval(RESET_WAIT_MILLISECONDS).pipe(
    mapTo(wechatyActions.reset(
      action.payload.message.wechaty,
      'HAWechaty/ha/epics.ts/resetEmitterEpic(action)',
    )),
    takeUntilRecover(action$),
  )),
)

/**
 * In:  ha$
 * Out:
 *  ations.failureWechaty
 *  actions.dingHA
 */
const dingEmitterEpic: RootEpic = action$ => ha$(action$).pipe(
  debounce(() => interval(DING_WAIT_MILLISECONDS)),
  switchMap(action => merge(
    of(actions.failureWechaty(action.payload.message.wechaty)),
    interval(DING_WAIT_MILLISECONDS).pipe(
      mapTo(actions.dingHA(
        operations.toChatieOA(action.payload.message.wechaty),
      )),
      takeUntilRecover(action$),
    )
  )),
)

export default {
  dingEmitterEpic,
  dongEmitterEpic,
  failureHAEmitterEpic,
  performDingEpic,
  recoverWechatyEmitterEpic,
  resetEmitterEpic,
}
