import { EventEmitter } from 'events'

import {
  Wechaty,
  WechatyOptions,
  Room,
  MemoryCard,
}                   from 'wechaty'

import { WechatyEventName } from 'wechaty/dist/src/wechaty'

import { StateSwitch } from 'state-switch'
import flattenArray from 'flatten-array'

import cuid from 'cuid'

import {
  VERSION,
  log,
}             from './config'

import {
  isWechatyAvailable,
  WechatyRedux,
  wechatyUse,
}                                 from './wechaty-redux'

import { envWechaty } from './env-wechaty'

export interface HAWechatyOptions {
  name?               : string,
  memory?             : MemoryCard,
  wechatyOptionsList? : WechatyOptions[],
}

export class HAWechaty extends EventEmitter {

  public id: string
  public state: StateSwitch

  public wechatyList: Wechaty[]

  private redux: WechatyRedux

  public Room = {
    findAll : this.roomFindAll.bind(this),
    load    : this.roomLoad.bind(this),
  }

  public async roomFindAll (): Promise<Room[]> {
    log.verbose('HAWechaty', 'roomFindAll()')
    const roomListList = Promise.all(
      this.wechatyList
        .filter(wechaty => wechaty.logonoff())
        .filter(isWechatyAvailable)
        .map(
          wechaty => wechaty.Room.findAll()
        )
    )

    const roomList = [] as Room[]

    /**
     * allRoomList may contain one room for multiple times
     * because we have more than one bot in the same room
     */
    const allRoomList = flattenArray(roomListList) as Room[]
    for (const room of allRoomList) {
      const exist = roomList.some(r => r.id === room.id)
      if (exist) {
        // We have a room in our list, so skip this one
        continue
      }
      roomList.push(room)
    }
    return roomList
  }

  public async roomLoad (id: string): Promise<null | Room> {
    log.verbose('HAWechaty', 'roomLoad(%s)', id)
    const roomList = this.wechatyList
      .filter(wechaty => wechaty.logonoff())
      .filter(isWechatyAvailable)
      .map(wechaty => wechaty.Room.load(id))

    for (const room of roomList) {
      try {
        await room.ready()
        if (room.isReady()) {
          log.verbose('HAWechaty', 'roomLoad() %s has room id %s', room.wechaty, room.id)
          return room
        }
      } catch (e) {
        log.verbose('HAWechaty', 'roomLoad() %s has no room id %s', room.wechaty, room.id)
      }
    }

    return null
  }

  constructor (
    public options: HAWechatyOptions = {},
  ) {
    super()
    log.verbose('HAWechaty', 'constructor("%s")', JSON.stringify(options))
    this.id = cuid()
    this.wechatyList = []
    this.state = new StateSwitch('HAWechaty')

    this.redux = new WechatyRedux()

    // TODO: init via the options
  }

  public name (): string {
    return this.wechatyList
      // .filter(wechaty => wechaty.logonoff())
      // .filter(wechaty => availableState[wechaty.id])
      .map(wechaty => wechaty.name())
      .join(',')
  }

  public version () {
    return VERSION
  }

  public async start () {
    log.verbose('HAWechaty', 'start()')

    try {
      this.state.on('pending')

      this.wechatyList.push(...envWechaty(this.options))

      if (this.wechatyList.length <= 0) {
        throw new Error('no wechaty puppet found')
      }

      this.wechatyList.forEach(wechaty => wechatyUse(wechaty, this.redux.plugin()))

      log.info('HAWechaty', 'start() %s puppet inited', this.wechatyList.length)
      await Promise.all(
        this.wechatyList.map(
          wechaty => wechaty.start()
        )
      )

      this.state.on(true)

    } catch (e) {
      log.warn('HAWechaty', 'start() rejection: %s', e)
      this.state.off(true)
    }

  }

  public async stop () {
    log.verbose('HAWechaty', 'stop()')

    try {
      this.state.off('pending')

      await Promise.all(
        this.wechatyList.map(
          wechaty => wechaty.stop()
        )
      )

    } catch (e) {
      log.warn('HAWechaty', 'stop() rejection: %s', e)
      throw e
    } finally {
      this.state.off(true)
    }
  }

  public logonoff (): boolean {
    log.verbose('HAWechaty', 'logonoff()')
    return this.wechatyList
      .filter(isWechatyAvailable)
      .some(wechaty => wechaty.logonoff())
  }

  public on (
    eventName     : WechatyEventName,
    handlerModule : string | Function,
  ): this {
    this.wechatyList.forEach(wechaty => wechaty.on(eventName as any, handlerModule as any))
    return this
  }

  public async logout (): Promise<void> {
    log.verbose('HAWechaty', 'logout()')

    await Promise.all(
      this.wechatyList.map(
        wechaty => wechaty.logout()
      )
    )
  }

  public async say (text: string): Promise<void> {
    log.verbose('HAWechaty', 'say(%s)', text)
    this.wechatyList
      .filter(wechaty => wechaty.logonoff())
      .filter(isWechatyAvailable)
      .forEach(wechaty => wechaty.say(text))
  }

}
