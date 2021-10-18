import { EventEmitter }  from 'events'

import type { Brolog }        from 'brolog'
import type { StateSwitch }   from 'state-switch'
import type { Wechaty }       from 'wechaty'

type DeprecatedProperties = never
  | 'userSelf'

type NonInterfaceProperties = never
  | 'log'
  | 'options'
  | 'pluginUninstallerList'
  | 'puppet'
  | 'readyState'
  | 'sleep'
  | 'waitForMessage'
  | 'wechaty'

type WechatyUserClass = never
  | 'Contact'
  | 'ContactSelf'
  | 'Friendship'
  | 'Image'
  | 'Location'
  | 'Message'
  | 'MiniProgram'
  | 'Moment'
  | 'Money'
  | 'Room'
  | 'RoomInvitation'
  | 'Tag'
  | 'UrlLink'

type KeyOfWechaty       = keyof Wechaty
type KeyOfEventEmitter  = keyof EventEmitter

type PublicProperties = Exclude<KeyOfWechaty, never
  | DeprecatedProperties
  | KeyOfEventEmitter
  | NonInterfaceProperties
  | WechatyUserClass
>

// https://stackoverflow.com/a/64754408/1123955
type WechatyInterface = Pick<Wechaty, PublicProperties>

abstract class W2 extends EventEmitter implements WechatyInterface {

  constructor () { super() }

  id: string
  log: Brolog
  state: StateSwitch

  currentUser : WechatyInterface['currentUser']
  ding        : WechatyInterface['ding']
  logonoff    : WechatyInterface['logonoff']
  logout      : WechatyInterface['logout']
  name        : WechatyInterface['name']
  ready       : WechatyInterface['ready']
  reset       : WechatyInterface['reset']
  say         : WechatyInterface['say']
  start       : WechatyInterface['start']
  stop        : WechatyInterface['stop']
  use         : WechatyInterface['use']
  version     : WechatyInterface['version']

}

export type { WechatyInterface }
