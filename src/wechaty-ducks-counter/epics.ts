import {
  isActionOf,
}                 from 'typesafe-actions'

import {
  from,
}                   from 'rxjs'
import {
  tap,
  filter,
  mergeMap,
  map,
}                   from 'rxjs/operators'

import { actions as wechatyActions } from '../wechaty-redux/ducks/'

import * as actions from './actions'

import {
  RootEpic,
}               from '../redux/'

import {
  getWechaty,
}                 from '../wechaty-redux/wechaty-redux'

const counterEpic: RootEpic = actions$ => actions$.pipe(
  tap(action => console.info('counterEpic:', action)),
  filter(isActionOf(wechatyActions.messageEvent)),
  mergeMap(action => {
    const wechaty = getWechaty(action.payload.wechatyId)
    const message = wechaty.Message.load(action.payload.messageId)

    return from(message.ready()).pipe(
      map(
        () => message.self()
          ? actions.moMessage()
          : actions.mtMessage()
      )
    )

  })
)

export {
  counterEpic,
}
