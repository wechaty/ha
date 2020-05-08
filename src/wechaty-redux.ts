import {
  Wechaty,
  log,
}             from 'wechaty'

import { timestampToDate } from 'wechaty/dist/src/helper-functions/pure/timestamp-to-date'

// import {
//   Store,
// }           from 'typesafe-actions'

import {
  from,
  fromEvent,
  forkJoin,
  merge,
  of,
}             from 'rxjs'
import {
  map,
  mapTo,
  mergeMap,
}             from 'rxjs/operators'

import * as wechatyDucks  from './ducks/wechaty'
import * as haDucks       from './ducks/ha'

import ducksStore from './ducks'

import {
  EventDongPayload,
  EventErrorPayload,
  EventScanPayload,
  EventRoomTopicPayload,
  EventRoomLeavePayload,
  EventRoomJoinPayload,
  EventRoomInvitePayload,
  EventReadyPayload,
  EventMessagePayload,
  EventLogoutPayload,
  EventLoginPayload,
  EventHeartbeatPayload,
  EventFriendshipPayload,
  EventResetPayload,
}                             from 'wechaty-puppet'

export const isWechatyAvailable = (wechaty: Wechaty) => haDucks.selectors.getWechatyAvailable(ducksStore.getState().ha, wechaty)

export type WechatyPlugin = (wechaty: Wechaty) => void

export interface WechatyReduxPluginOptions {

}

const store = ducksStore

const wechatyStore = new Map<string, Wechaty>()

export const getWechaty = (id: string) => {
  const wechaty = wechatyStore.get(id)
  if (!wechaty) {
    throw new Error('no wechaty found for id ' + id)
  }
  return wechaty
}

export const getMessage = (wechatyId: string, id: string) => getWechaty(wechatyId).Message.load(id)
export const getRoom    = (wechatyId: string, id: string) => getWechaty(wechatyId).Room.load(id)
export const getContact = (wechatyId: string, id: string) => getWechaty(wechatyId).Contact.load(id)

export class WechatyRedux {

  public store : any

  constructor () {
    log.verbose('WechatyRedux', 'constructor()')
    this.store = store
  }

  public plugin (options: WechatyReduxPluginOptions = {}) {
    log.verbose('WechatyRedux', 'plugin("%s")', JSON.stringify(options))
    return (wechaty: Wechaty) => this.install(wechaty)
  }

  protected install (wechaty: Wechaty): void {
    log.verbose('WechatyRedux', 'install(%s)', wechaty)

    /**
     * Save wechaty id with the instance for the future usage
     */
    wechatyStore.set(wechaty.id, wechaty)

    /**
     * Actually, we are not installing to the Wechaty,
     *  but the Puppet for convenience
     */
    /* eslint-disable func-call-spacing */
    const switchOn$  = fromEvent(wechaty.puppet.state, 'on')
    const switchOff$ = fromEvent(wechaty.puppet.state, 'off')

    const dong$       = fromEvent<EventDongPayload>       (wechaty.puppet, 'dong')
    const error$      = fromEvent<EventErrorPayload>      (wechaty.puppet, 'error')
    const friendship$ = fromEvent<EventFriendshipPayload> (wechaty.puppet, 'friendship')
    const heartbeat$  = fromEvent<EventHeartbeatPayload>  (wechaty.puppet, 'heartbeat')
    const login$      = fromEvent<EventLoginPayload>      (wechaty.puppet, 'login')
    const logout$     = fromEvent<EventLogoutPayload>     (wechaty.puppet, 'logout')
    const message$    = fromEvent<EventMessagePayload>    (wechaty.puppet, 'message')
    const ready$      = fromEvent<EventReadyPayload>      (wechaty.puppet, 'ready')
    const reset$      = fromEvent<EventResetPayload>      (wechaty.puppet, 'reset')
    const roomInvite$ = fromEvent<EventRoomInvitePayload> (wechaty.puppet, 'room-invite')
    const roomJoin$   = fromEvent<EventRoomJoinPayload>   (wechaty.puppet, 'room-join')
    const roomLeave$  = fromEvent<EventRoomLeavePayload>  (wechaty.puppet, 'room-leave')
    const roomTopic$  = fromEvent<EventRoomTopicPayload>  (wechaty.puppet, 'room-topic')
    const scan$       = fromEvent<EventScanPayload>       (wechaty.puppet, 'scan')

    merge(
      /**
       * Huan(202004):
       *  We are using `merge` inside `merge` because the typing system for the arguments of `merge()`
       *  only support maximum 6 arguments at the same time.
       */

      /*  eslint-disable no-whitespace-before-property */
      merge(
        switchOn$   .pipe(map(status => wechatyDucks.actions.turnOnSwitch(wechaty, status))),
        switchOff$  .pipe(map(status => wechatyDucks.actions.turnOffSwitch(wechaty, status))),
      ),
      merge(
        dong$       .pipe(map(payload => wechatyDucks.actions.dongEvent(wechaty, payload))),
        error$      .pipe(map(payload => wechatyDucks.actions.errorEvent(wechaty, payload))),
        friendship$ .pipe(map(payload => wechatyDucks.actions.friendshipEvent(wechaty, payload))),
        heartbeat$  .pipe(map(payload => wechatyDucks.actions.heartbeatEvent(wechaty, payload))),
        login$      .pipe(map(payload => wechatyDucks.actions.loginEvent(wechaty,     payload))),
        logout$     .pipe(map(payload => wechatyDucks.actions.logoutEvent(wechaty,    payload))),
      ),
      merge(
        message$    .pipe(map(payload => wechatyDucks.actions.messageEvent(wechaty, payload))),
        ready$      .pipe(map(payload => wechatyDucks.actions.readyEvent(wechaty,   payload))),
        reset$      .pipe(map(payload => wechatyDucks.actions.resetEvent(wechaty,   payload))),
      ),
      merge(
        roomInvite$ .pipe(map(payload => wechatyDucks.actions.roomInviteEvent(wechaty,  payload))),
        roomJoin$   .pipe(map(payload => wechatyDucks.actions.roomJoinEvent(wechaty,    payload))),
        roomLeave$  .pipe(map(payload => wechatyDucks.actions.roomLeaveEvent(wechaty,   payload))),
        roomTopic$  .pipe(map(payload => wechatyDucks.actions.roomTopicEvent(wechaty,   payload))),
      ),
      scan$         .pipe(map(payload => wechatyDucks.actions.scanEvent(wechaty, payload))),
    ).subscribe(this.store.dispatch)

  }

}
