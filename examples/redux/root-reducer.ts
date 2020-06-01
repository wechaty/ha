import { combineReducers }  from 'redux'

import counter from '../../src/wechaty-ducks-counter/'
import ha      from '../../src/api/'
import wechaty from '../../src/wechaty-redux/api'

export default combineReducers({
  counter,
  ha,
  wechaty,
})
