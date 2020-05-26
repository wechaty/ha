import {
  isActionOf,
}                 from 'typesafe-actions'

import {
  filter,
  mergeMap,
  map,
}                   from 'rxjs/operators'

import {
  api as wechatyAPI,
}                           from '../wechaty-redux/'

import * as actions from './actions'

import {
  RootEpic,
}               from '../redux/'

const counterEpic: RootEpic = actions$ => actions$.pipe(
  filter(isActionOf(wechatyAPI.actions.messageEvent)),
  mergeMap(wechatyAPI.utils.toMessage$),
  map(message => message.self()
    ? actions.moMessage(message.wechaty.id)
    : actions.mtMessage(message.wechaty.id)
  )
)

export {
  counterEpic,
}
