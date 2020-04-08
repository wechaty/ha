import {
  fromEvent,
  merge,
  interval,
}               from 'rxjs'
import {
  filter,
  switchMap,
  debounce,
  takeUntil,
  tap,
}               from 'rxjs/operators'

import {
  Message,
  Wechaty,
  Contact,
}                   from 'wechaty'

import {
  log,
}             from './config'

const CHATIE_OA_ID = 'gh_051c89260e5d'  // chatieio official account
const DING = 'ding'
const DONG = 'dong'

/**
 * State
 */
export const availableState: {
  [wechatyId: string]: boolean
} = {}

/**
 * Filters
 */
const switchSuccess = (status: true | 'pending') => status === true

const isChatieOA  = (message: Message) => message.from()!.id === CHATIE_OA_ID
const isDong      = (message: Message) => message.text() === DONG

const notSelf     = (message: Message) => !message.self()

/**
 * Mappers
 */
const chatieOA = (wechaty: Wechaty): Contact => {
  const contact = wechaty.Contact.load(CHATIE_OA_ID)
  contact.ready().catch(e => {
    log.error('heartbeat$', 'chatie(%s) contact.ready() rejection: %s', wechaty, e)
    const error = new Error(`

    In order to use HAWechaty, we need to follow WeChat Official Account "chatieio" first.
    See #1: https://github.com/wechaty/HAWechaty/issues/1

    `)
    wechaty.emit('error', error)
  })
  return contact
}

/**
 * Actions
 */
const dingChatie = (wechaty: Wechaty) => () => chatieOA(wechaty).say(DING)
  .catch(e => log.error('heartbeat$', 'dingChatie() say() rejection: %s', e))
const unAvailable = (wechaty: Wechaty) => () => {
  log.warn('heartbeat$', 'unAvailable(%s)', wechaty)
  availableState[wechaty.id] = false
}
const available = (wechaty: Wechaty) => () => (availableState[wechaty.id] = true)

/**
 * Observables
 */
const message$ = (wechaty: Wechaty) => fromEvent<Message>(wechaty, 'message').pipe(filter(notSelf))
const switchOn$ = (wechaty: Wechaty) => fromEvent(wechaty.state, 'on')
const switchOff$ = (wechaty: Wechaty) => fromEvent(wechaty.state, 'off')

const messageChatieDong$ = (wechaty: Wechaty) => message$(wechaty).pipe(
  filter(isChatieOA),
  filter(isDong),
  tap(available(wechaty)),
)

/**
 * Streams
 */

// Heartbeat stream is like ECG (ElectroCardioGraphy)
const switchOnHeartbeat$ = (wechaty: Wechaty) => switchOn$(wechaty).pipe(
  filter(switchSuccess),
  tap(_ => log.verbose('heartbeat$', 'switchOnHeartbeat$() switchOn$ fired')),
  switchMap(_ => message$(wechaty).pipe(
    tap(message => log.verbose('heartbeat$', 'switchOnHeartbeat$() message$(): %s', message)),
  ))
)

// Ding is like CPR (Cardio Pulmonary Resuscitation)
export const heartbeatDing$ = (wechaty: Wechaty) => switchOnHeartbeat$(wechaty).pipe(
  debounce(() => interval(16 * 1000)),
  tap(_ => log.verbose('heartbeat$', 'heartbeatDing$() no heartbeat after 16s')),
  switchMap(_ => interval(16 * 1000).pipe(
    tap(dingChatie(wechaty)),
    takeUntil(messageChatieDong$(wechaty)),
    takeUntil(switchOff$(wechaty)), // HAWechaty can do this.
  ))
)

// Reset is like AED (Automated External Defibrillator)
export const heartbeatTimeout$ = (wechaty: Wechaty) => switchOnHeartbeat$(wechaty).pipe(
  debounce(_ => interval(64 * 1000)),
  tap(unAvailable(wechaty)),
)

/**
 * Main stream
 */
export const heartbeat$ = (wechatyList: Wechaty[]) => {
  log.verbose('HAWechaty', 'heartbeat$(%s)',
    wechatyList
      .map(wechaty => wechaty.toString())
      .join(','),
  )
  return merge(
    wechatyList.map(wechaty => merge(
      heartbeatDing$(wechaty),
      heartbeatTimeout$(wechaty),
    )),
  )
}
