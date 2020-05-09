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
import * as utils       from './utils'

const DING_WAIT_MILLISECONDS  = utils.milliAroundSeconds(60)
const RESET_WAIT_MILLISECONDS = utils.milliAroundSeconds(300)

/**
 * Huan(202004):
 *  We are using `messageEvent` at here, not `heartbeatEvent` for reasons.
 *
 *  e.g.:
 *    `heartbeatEvent` is not suitable at here,
 *    because the hostie server will emit heartbeat no matter than WeChat protocol available or not.
 */
const takeUntilDong = <T>(wechatyId: string, action$: ReturnType<RootEpic>) => takeUntil<T>(
  action$.pipe(
    filter(isActionOf(actions.dong)),
    filter(utils.belongsToWechaty(wechatyId)),
  ),
)

const takeUntilLoginout = <T>(wechatyId: string, action$: ReturnType<RootEpic>) => takeUntil<T>(
  action$.pipe(
    filter(isActionOf([
      wechatyActions.loginEvent,
      wechatyActions.logoutEvent,
    ])),
    filter(utils.belongsToWechaty(wechatyId)),
  ),
)

/**
 * High Available Stream Entrance
 *  emit all messages that come from the logged in wechaty(s)
 *
 * In:  RootAction
 * Out: wechatyActions.messageEvent groupBy wechatyId
 */
const wechatyMessage$$ = (action$: ReturnType<RootEpic>) => action$.pipe(
  filter(isActionOf(wechatyActions.loginEvent)),
  map(action => action.payload.wechatyId),

  /**
   * mergeMap instead of switchMap:
   *  there might be multiple Wechaty instance passed to here
   */
  mergeMap(wechatyId => action$.pipe(
    filter(isActionOf(wechatyActions.messageEvent)),
    filter(utils.belongsToWechaty(wechatyId)),
    filter(utils.isMessageFromSelf(false)),
    takeUntilLoginout(wechatyId, action$),
  )),

  groupBy(action => action.payload.wechatyId),
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
  mergeMap(action => from(utils.sayDingTo(action.payload.wechatyId, action.payload.contactId)).pipe(
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
  filter(utils.isMessageTypeText),
  filter(utils.isMessageTextDong),
  map(action => actions.dong(action.payload.wechatyId, action.payload.messageId)),
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
    of(actions.recoverWechaty(action.payload.wechatyId)),
    // Recover HA
    of(actions.recoverHA(selectors.getHAByWechatyId(
      state$.value.ha,
      action.payload.wechatyId,
    ))).pipe(
      filter(_ => !selectors.getWechatyAvailable(
        state$.value.ha,
        action.payload.wechatyId,
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
  filter(action => !selectors.getWechatyAvailable(
    state$.value.ha,
    action.payload.wechatyId,
  )),
  map(action => actions.failureHA(
    selectors.getHAByWechatyId(
      state$.value.ha,
      action.payload.wechatyId,
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
      action.payload.wechatyId,
      'HAWechaty/ha/epics.ts/resetEmitterEpicPerWechaty$(action)',
    )),
    takeUntilDong(action.payload.wechatyId, action$),
    takeUntilLoginout(action.payload.wechatyId, action$),
  )),
)

/**
 * In:  ha$
 * Out:
 *  actions.failureWechaty
 *  actions.ding
 */
const dingEmitterPerWechaty$ = (
  action$         : ReturnType<RootEpic>,
  wechatyMessage$ : GroupedMessageByWechaty,
) => wechatyMessage$.pipe(
  debounce(() => interval(DING_WAIT_MILLISECONDS)),
  switchMap(action => merge(
    of(actions.failureWechaty(action.payload.wechatyId)),
    interval(DING_WAIT_MILLISECONDS).pipe(
      mapTo(actions.ding(
        utils.toChatieOA(action.payload.wechatyId),
      )),
      takeUntilDong(action.payload.wechatyId, action$),
      takeUntilLoginout(action.payload.wechatyId, action$),
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
