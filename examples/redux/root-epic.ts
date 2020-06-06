import { combineEpics } from 'redux-observable'

import { Duck as WechatyDuck }    from 'wechaty-redux'
import { Counter as CounterDuck } from 'wechaty-ducks-contrib'

import * as HaDuck                from '../../src/duck/'

export default combineEpics(
  ...Object.values(HaDuck.epics),
  ...Object.values(WechatyDuck.epics),
  ...Object.values(CounterDuck.epics),
)
