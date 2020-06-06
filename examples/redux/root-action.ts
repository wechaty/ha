import { Duck as WechatyDuck }    from 'wechaty-redux'
import { Counter as CounterDuck } from 'wechaty-ducks-contrib'

import * as HaDuck                from '../../src/duck/'

export default {
  counter : CounterDuck.actions,
  ha      : HaDuck.actions,
  wechaty : WechatyDuck.actions,
}
