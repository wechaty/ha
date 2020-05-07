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
  merge,
  forkJoin,
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

    const friendshipPayloadToAction = mergeMap((payload: EventFriendshipPayload) => {
      const friendship = wechaty.Friendship.load(payload.friendshipId)
      return from(friendship.ready()).pipe(
        mapTo(wechatyDucks.actions.friendshipEvent(friendship)),
      )
    })
    const loginoutPayloadToAction = mergeMap((payload: EventLoginPayload | EventLogoutPayload) => {
      const contact = wechaty.Contact.load(payload.contactId)
      return from(contact.ready()).pipe(
        mapTo(wechatyDucks.actions.loginEvent(contact)),
      )
    })
    const messagePayloadToAction = mergeMap((payload: EventMessagePayload) => {
      const message = wechaty.Message.load(payload.messageId)
      return from(message.ready()).pipe(
        mapTo(wechatyDucks.actions.messageEvent(message)),
      )
    })
    const roomJoinPayloadToAction = mergeMap((payload: EventRoomJoinPayload) => {
      const room        = wechaty.Room.load(payload.roomId)
      const inviteeList = payload.inviteeIdList.map(id => wechaty.Contact.load(id))
      const inviter     = wechaty.Contact.load(payload.inviterId)
      const date        = timestampToDate(payload.timestamp)

      return forkJoin(
        from(room.ready()),
        from(inviter.ready()),
        from(Promise.all(inviteeList.map(c => c.ready()))),
      ).pipe(
        mapTo(wechatyDucks.actions.roomJoinEvent(room, inviteeList, inviter, date)),
      )
    })
    const roomLeavePayloadToAction = mergeMap((payload: EventRoomLeavePayload) => {
      const room        = wechaty.Room.load(payload.roomId)
      const removeeList = payload.removeeIdList.map(id => wechaty.Contact.load(id))
      const remover     = wechaty.Contact.load(payload.removerId)
      const date        = timestampToDate(payload.timestamp)

      return forkJoin(
        from(room.ready()),
        from(remover.ready()),
        from(Promise.all(removeeList.map(c => c.ready()))),
      ).pipe(
        mapTo(wechatyDucks.actions.roomLeaveEvent(room, removeeList, remover, date)),
      )
    })
    const roomTopicPayloadToAction = mergeMap((payload: EventRoomTopicPayload) => {
      const room        = wechaty.Room.load(payload.roomId)
      const changer     = wechaty.Contact.load(payload.changerId)
      const date        = timestampToDate(payload.timestamp)

      return forkJoin(
        from(room.ready()),
        from(changer.ready()),
      ).pipe(
        mapTo(wechatyDucks.actions.roomTopicEvent(room, payload.newTopic, payload.oldTopic, changer, date)),
      )
    })

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
        dong$       .pipe(map(payload => wechatyDucks.actions.dongEvent(wechaty, payload.data))),
        error$      .pipe(map(payload => wechatyDucks.actions.errorEvent(wechaty, payload.data))),
        friendship$ .pipe(friendshipPayloadToAction),
        heartbeat$  .pipe(map(payload => wechatyDucks.actions.heartbeatEvent(wechaty, payload.data))),
        login$      .pipe(loginoutPayloadToAction),
        logout$     .pipe(loginoutPayloadToAction),
      ),
      merge(
        message$    .pipe(messagePayloadToAction),
        ready$      .pipe(map(payload => wechatyDucks.actions.readyEvent(wechaty, payload.data))),
        reset$      .pipe(map(payload => wechatyDucks.actions.resetEvent(wechaty, payload.data))),
      ),
      merge(
        roomInvite$ .pipe(map(payload => wechatyDucks.actions.roomInviteEvent(wechaty.RoomInvitation.load(payload.roomInvitationId)))),
        roomJoin$   .pipe(roomJoinPayloadToAction),
        roomLeave$  .pipe(roomLeavePayloadToAction),
        roomTopic$  .pipe(roomTopicPayloadToAction),
      ),
      scan$         .pipe(map(payload => wechatyDucks.actions.scanEvent(wechaty, payload))),
    ).subscribe(this.store.dispatch)

  }

}
