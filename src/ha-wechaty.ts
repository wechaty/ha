/**
 *   Wechaty Open Source Software - https://github.com/wechaty
 *
 *   @copyright 2016 Huan LI (李卓桓) <https://github.com/huan>, and
 *                   Wechaty Contributors <https://github.com/wechaty>.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import { EventEmitter }     from 'events'
import type {
  Contact,
  // Message,
  Room,
  Sayable,
  Wechaty,
  WechatyEventName,
  WechatyPlugin,
  impl,
  ContactSelf,
}                           from 'wechaty'
import type { MemoryCard } from 'memory-card'

import {
}                           from 'wechaty'
import {
  GError,
}                   from 'gerror'
import type * as PUPPET from 'wechaty-puppet'
import {
  log,
  throwUnsupportedError,
}                           from 'wechaty-puppet'
import {
  StateSwitch,
  serviceCtlFsmMixin,
}                     from 'state-switch'
import uuid            from 'uuid'
import type {
  Bundle,
  Ducks,
}                           from 'ducks'
import type { DucksMapObject } from 'ducks/dist/esm/src/duck.js'

import { WechatyRedux } from 'wechaty-redux'

import {
  VERSION,
}                     from './config.js'
import * as haDuck    from './duck/mod.js'
import { addHa } from './global-instance-manager.js'

export interface HAWechatyOptions<T extends DucksMapObject> {
  name?   : string,
  memory? : MemoryCard,
  ducks   : Ducks<T>,
}

const mixinBase = serviceCtlFsmMixin('HAWechaty', { log })(EventEmitter)

export class HAWechaty <T extends DucksMapObject = any> extends mixinBase implements Wechaty {

  id: string

  // state: StateSwitch
  bundle: Bundle<typeof haDuck>
  ducks: Ducks<T>

  protected wechatyList: Wechaty[]

  protected _wechatifiedContact?        : impl.ContactConstructor
  protected _wechatifiedContactSelf?    : impl.ContactSelfConstructor
  protected _wechatifiedFriendship?     : impl.FriendshipConstructor
  protected _wechatifiedImage?          : impl.ImageConstructor
  protected _wechatifiedMessage?        : impl.MessageConstructor
  protected _wechatifiedMiniProgram?    : impl.MiniProgramConstructor
  protected _wechatifiedRoom?           : impl.RoomConstructor
  protected _wechatifiedRoomInvitation? : impl.RoomInvitationConstructor
  protected _wechatifiedDelay?          : impl.DelayConstructor
  protected _wechatifiedTag?            : impl.TagConstructor
  protected _wechatifiedUrlLink?        : impl.UrlLinkConstructor
  protected _wechatifiedLocation?       : impl.LocationConstructor

  get Contact ()        : impl.ContactConstructor        { return guardWechatify(this._wechatifiedContact)        }
  get ContactSelf ()    : impl.ContactSelfConstructor    { return guardWechatify(this._wechatifiedContactSelf)    }
  get Friendship ()     : impl.FriendshipConstructor     { return guardWechatify(this._wechatifiedFriendship)     }
  get Image ()          : impl.ImageConstructor          { return guardWechatify(this._wechatifiedImage)          }
  get Message ()        : impl.MessageConstructor        { return guardWechatify(this._wechatifiedMessage)        }
  get MiniProgram ()    : impl.MiniProgramConstructor    { return guardWechatify(this._wechatifiedMiniProgram)    }
  get Room ()           : impl.RoomConstructor           { return guardWechatify(this._wechatifiedRoom)           }
  get RoomInvitation () : impl.RoomInvitationConstructor { return guardWechatify(this._wechatifiedRoomInvitation) }
  get Delay ()          : impl.DelayConstructor          { return guardWechatify(this._wechatifiedDelay)          }
  get Tag ()            : impl.TagConstructor            { return guardWechatify(this._wechatifiedTag)            }
  get UrlLink ()        : impl.UrlLinkConstructor        { return guardWechatify(this._wechatifiedUrlLink)        }
  get Location ()       : impl.LocationConstructor       { return guardWechatify(this._wechatifiedLocation)       }

  protected async contactLoad (id: string): Promise<undefined | Contact> {
    log.verbose('HAWechaty', 'contactLoad(%s)', id)
    const contactListAll = await Promise.all(
      this.wechatyList
        .filter(wechaty => wechaty.logonoff())
        .filter(this.bundle.selectors.isWechatyAvailable)
        .map(wechaty => wechaty.Contact.find({ id })),
    )

    log.verbose('HAWechaty', 'contactLoad() found %s contact(s) total', contactListAll.length)
    const contactList = contactListAll.filter(Boolean) as Contact[] // filter out undefined
    log.verbose('HAWechaty', 'contactLoad() found %s contact(s) valid', contactList.length)

    if (contactList.length > 0) {
      const randomIndex = Math.floor(Math.random() * contactList.length)
      return contactList[randomIndex]!
    }

    return undefined
  }

  async roomFindAll (): Promise<Room[]> {
    log.verbose('HAWechaty', 'roomFindAll()')
    const roomListList = await Promise.all(
      this.wechatyList
        .filter(wechaty => wechaty.logonoff())
        .filter(
          this.bundle.selectors.isWechatyAvailable,
          // haApi.selectors.isWechatyAvailable(this.duckState())
        )
        .map(
          wechaty => wechaty.Room.findAll(),
        ),
    )

    // const roomList = [] as Room[]

    /**
     * allRoomList may contain one room for multiple times
     * because we have more than one bot in the same room
     */
    const allRoomList = roomListList.flat()
    // for (const room of allRoomList) {
    //   const exist = roomList.some(r => r.id === room.id)
    //   if (exist) {
    //     // We have a room in our list, so skip this one
    //     continue
    //   }
    //   roomList.push(room)
    // }
    // return roomList
    return allRoomList
  }

  async roomLoad (id: string): Promise<undefined | Room> {
    log.verbose('HAWechaty', 'roomLoad(%s)', id)

    const roomListAll = await Promise.all(
      this.wechatyList
        .filter(wechaty => wechaty.logonoff())
        .filter(this.bundle.selectors.isWechatyAvailable)
        .map(wechaty => wechaty.Room.find({ id })),
    )

    log.verbose('HAWechaty', 'roomLoad() found %s room(s) total', roomListAll.length)
    const roomList = roomListAll.filter(Boolean) as Room[] // filter out undefined
    log.verbose('HAWechaty', 'roomLoad() found %s room(s) valid', roomList.length)

    if (roomList.length > 0) {
      const randomIndex = Math.floor(Math.random() * roomList.length)
      return roomList[randomIndex]!
    }

    return undefined
  }

  constructor (
    options: HAWechatyOptions<T>,
  ) {
    super()
    log.verbose('HAWechaty', 'constructor("%s")', JSON.stringify(options))
    this.state = new StateSwitch('HAWechaty')

    this.id = uuid.v4()
    this.wechatyList = []

    this.bundle = options.ducks.ducksify(haDuck as any) as any
    this.ducks = options.ducks

    addHa(this)
  }

  name (): string {
    return this.wechatyList
      // .filter(wechaty => wechaty.logonoff())
      // .filter(wechaty => availableState[wechaty.id])
      .map(wechaty => wechaty.name())
      .join(',')
  }

  version () {
    return VERSION
  }

  add (...wechatyList: Wechaty[]): this {
    log.verbose('HAWechaty', 'add(%s)',
      wechatyList
        .map(wechaty => wechaty.name())
        .join(', '),
    )

    const store = this.bundle.store

    for (const wechaty of wechatyList) {
      log.verbose('HAWechaty', 'add() installing WechatyRedux to %s ...', wechaty)

      wechaty.use(WechatyRedux({ store }))
      this.emit('wechaty', wechaty)

      this.bundle.operations.add(this, wechaty)

      if (wechaty.state.inactive()) {
        log.silly('HAWechaty', 'add() %s is starting', wechaty)
        wechaty.wrapAsync(
          wechaty.state.stable().then(
            () => wechaty.start(),
          ),
        )
      } else {
        log.verbose('HAWechaty', 'add() skip starting for %s', wechaty)
      }

      if (wechaty.logonoff()) {
        this.bundle.operations.recoverWechaty(wechaty)
      }

    }

    this.wechatyList.push(
      ...wechatyList,
    )

    return this
  }

  /**
   * @deprecated use remove instead
   */
  del (...args: any[]): this {
    return this.remove(...args)
  }

  remove (...wechatyList: Wechaty[]): this {
    log.verbose('HAWechaty', 'del(%s)',
      wechatyList
        .map(wechaty => wechaty.name())
        .join(', '),
    )
    throw new Error('to be implemented')
  }

  nodes (): Wechaty[] {
    log.verbose('HAWechaty', 'nodes() total %s wechaty instances are under management', this.wechatyList.length)
    return this.wechatyList
  }

  test () {

    this._wechatifiedContact = {
      load : this.contactLoad.bind(this),
    } as any

    this._wechatifiedRoom = {
      findAll : this.roomFindAll.bind(this),
      load    : this.roomLoad.bind(this),
    } as any
  }

  override async onStart (): Promise<void> {
    log.verbose('HAWechaty', 'onStart()')

    if (this.wechatyList.length <= 0) {
      throw new Error('no wechaty puppet found')
    }

    log.verbose('HAWechaty', 'onStart() %s wechaty instance found. Initializing ...', this.wechatyList.length)

    for (const wechaty of this.wechatyList) {
      log.silly('HAWechaty', 'onStart() %s starting', wechaty)
      if (wechaty.state.inactive()) {
        await wechaty.state.stable()
        await wechaty.start()
      } else {
        log.verbose('HAWechaty', 'onStart() %s skip starting: its already started.', wechaty)
      }

      if (wechaty.logonoff()) {
        this.bundle.operations.recoverWechaty(wechaty)
      }

    }
  }

  override async onStop () {
    log.verbose('HAWechaty', 'onStop()')

    await Promise.all(
      this.wechatyList.map(
        wechaty => wechaty.stop(),
      ),
    )

    /**
     * Delete all Wechaty instances
     *  Huan(202005) TODO: make sure they are GC-ed?
     */
    this.wechatyList = []
  }

  use (
    ...plugins: (
      WechatyPlugin | WechatyPlugin[]
    )[]
  ): Wechaty {
    const pluginList = plugins.flat()
    log.verbose('HAWechaty', 'use(%s)',
      pluginList.map(
        plugin => plugin.name,
      ).join(','),
    )

    /**
     * for internal plugin usage
     */
    ;(this.on as any)('wechaty', (wechaty: Wechaty) => wechaty.use(...pluginList))

    if (this.wechatyList.length > 0) {
      this.wechatyList.forEach(wechaty => wechaty.use(...pluginList))
    }

    // Huan(202110): FIXME: remove any
    return this as any
  }

  ready (): Promise<void> {
    log.verbose('HAWechaty', 'ready()')
    const readyList = this.wechatyList
      .filter(
        this.bundle.selectors.isWechatyAvailable,
        // haApi.selectors.isWechatyAvailable(this.duckState())
      )
      .map(wechaty => wechaty.ready())

    return Promise.race(readyList)
  }

  logonoff (): boolean {
    log.verbose('HAWechaty', 'logonoff()')
    return this.wechatyList
      .filter(
        this.bundle.selectors.isWechatyAvailable,
        // haApi.selectors.isWechatyAvailable(this.duckState())
      )
      .some(wechaty => wechaty.logonoff())
  }

  override on (
    eventName     : WechatyEventName,
    handlerModule : string | Function,
  ): this {
    this.wechatyList.forEach(wechaty => wechaty.on(eventName as any, handlerModule as any))
    return this
  }

  async logout (): Promise<void> {
    log.verbose('HAWechaty', 'logout()')

    await Promise.all(
      this.wechatyList.map(
        wechaty => wechaty.logout(),
      ),
    )
  }

  async say (sayableMsg: Sayable): Promise<void> {
    log.verbose('HAWechaty', 'say(%s)', sayableMsg)
    const wechatyList = this.wechatyList
      .filter(wechaty => wechaty.logonoff())
      .filter(
        this.bundle.selectors.isWechatyAvailable,
        // haApi.selectors.isWechatyAvailable(this.duckState())
      )

    if (wechatyList.length <= 0) {
      this.emitError(new Error('no wechaty instance available'))
      return
    }

    const wechaty = wechatyList[
      Math.floor(
        wechatyList.length * Math.random(),
      )
    ]

    if (wechaty) {
      await wechaty.say(sayableMsg)
    } else {
      this.emitError(new Error('no wechaty instance available'))
    }
  }

  emitError (e: unknown): void {
    this.emit('error', GError.from(e))
  }

  currentUser (): ContactSelf {
    return throwUnsupportedError()
  }

  get puppet (): PUPPET.impl.PuppetInterface {
    return throwUnsupportedError()
  }

  sleep (milliseconds: number): Promise<void> {
    return throwUnsupportedError(milliseconds)
  }

  ding (data?: string): void {
    return throwUnsupportedError(data)
  }

  wrapAsync: Wechaty['wrapAsync'] = (...args: any[]) => throwUnsupportedError(...args)

}

/**
 * Huan(202008): we will bind the wechaty puppet with user modules (Contact, Room, etc) together inside the start() method
 */
function guardWechatify<T extends Function> (userModule?: T): T {
  if (!userModule) {
    throw new Error('Wechaty user module (for example, wechaty.Room) can not be used before wechaty.start()!')
  }
  return userModule
}
