import { combineReducers }  from 'redux'

import counter from '../wechaty-ducks-counter/'
import ha      from '../api/'
import wechaty from '../wechaty-redux/api'

export default combineReducers({
  counter,
  ha,
  wechaty,
})
