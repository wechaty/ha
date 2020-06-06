import {
  from,
  of,
}               from 'rxjs'
import {
  catchError,
  ignoreElements,
}                   from 'rxjs/operators'

import {
  DING,
}             from '../config'

import {
  getWechaty,
  Duck as WechatyDuck,
}                       from 'wechaty-redux'

// import {
//   State,
// }               from './reducers'

// import * as selectors from './selectors'
import * as actions   from './actions'

// import {
//   PayloadAllId,
// }                   from './config'

// const emitError$ = <T extends { payload: PayloadAllId }>(action: T, state: State) => (error: any) => {
//   const wechaty = getWechaty(action.payload.wechatyId)
//   const ha = selectors.getHAOfWechatyId(state, wechaty.id)
//   wechaty.emit('error', error)
//   ha.emit('error', error)
//   return EMPTY
// }

const ding$ = (action: ReturnType<typeof actions.ding>) => from(
  getWechaty(action.payload.wechatyId)
    .Contact.load(action.payload.contactId)
    .say(DING)
).pipe(
  ignoreElements(),
  catchError(e => of(
    WechatyDuck.actions.errorEvent(
      action.payload.wechatyId,
      { data: String(e) },
    )
  )),
)

export {
  ding$,
  // emitError$,
}
