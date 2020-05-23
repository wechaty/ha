import {
  isActionOf,
}                 from 'typesafe-actions'

import {
  filter,
  mergeMap,
  map,
}                   from 'rxjs/operators'

import {
  actions as wechatyActions,
  utils as wechatyUtils,
}                           from '../wechaty-redux/duck-api'

import * as actions from './actions'

import {
  RootEpic,
}               from '../redux/'

const counterEpic: RootEpic = actions$ => actions$.pipe(
  filter(isActionOf(wechatyActions.messageEvent)),
  mergeMap(wechatyUtils.toMessage$),
  map(message => message.self()
    ? actions.moMessage(message.wechaty.id)
    : actions.mtMessage(message.wechaty.id)
  )
)

export {
  counterEpic,
}
