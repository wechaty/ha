import { combineReducers }  from 'redux'

import { Duck as WechatyDuck }    from 'wechaty-redux'
import { Counter as CounterDuck } from 'wechaty-ducks-contrib'

import * as HaDuck                from '../../src/duck/'

export default combineReducers({
  counter : CounterDuck.default,
  ha      : HaDuck.default,
  wechaty : WechatyDuck.default,
})
