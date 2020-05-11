import {
  isActionOf,
}                 from 'typesafe-actions'

import {
  interval,
  of,
  merge,
  Observable,
}                 from 'rxjs'
import {
  debounce,
  filter,
  map,
  mapTo,
  mergeMap,
  switchMap,
  takeUntil,
  groupBy,
}                   from 'rxjs/operators'

import {
  RootEpic,
}               from '../redux/'

import {
  actions as wechatyActions,
  utils as wechatyUtils,
}                             from '../wechaty-redux/ducks/'

import {
  CHATIE_OA_ID,
  DONG,
}                     from '../config'

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
    filter(action => action.payload.wechatyId === wechatyId),
  ),
)

const takeUntilLoginout = <T>(wechatyId: string, action$: ReturnType<RootEpic>) => takeUntil<T>(
  action$.pipe(
    filter(isActionOf([
      wechatyActions.loginEvent,
      wechatyActions.logoutEvent,
    ])),
    filter(action => action.payload.wechatyId === wechatyId),
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
    filter(wechatyUtils.isWechaty(wechatyId)),
    mergeMap(wechatyUtils.skipSelfMessage$),
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
const dingEvokerEpic: RootEpic = (action$) => action$.pipe(
  filter(isActionOf(actions.ding)),
  mergeMap(operations.ding$),
)

/**
 * In:  wechatyActions.messageEvent
 * Out: actions.dongHA
 */
const dongEmitterEpic: RootEpic = action$ => action$.pipe(
  filter(isActionOf(wechatyActions.messageEvent)),
  mergeMap(wechatyUtils.toMessage$),
  filter(wechatyUtils.isTextMessage(DONG)),
  map(message => actions.dong(message.wechaty.id, message.id)),
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
    of(actions.recoverHA(
      selectors.getHAOfWechatyId(
        state$.value.ha,
        action.payload.wechatyId,
      ).id
    )).pipe(
      filter(_ => !selectors.isWechatyAvailable(
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
  filter(action => !selectors.isWechatyAvailable(
    state$.value.ha,
    action.payload.wechatyId,
  )),
  map(action => actions.failureHA(
    selectors.getHAOfWechatyId(
      state$.value.ha,
      action.payload.wechatyId,
    ).id,
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
      'ha-wechaty/ducks/epics.ts/resetEmitterEpicPerWechaty$(action)',
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
        action.payload.wechatyId,
        CHATIE_OA_ID,
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
