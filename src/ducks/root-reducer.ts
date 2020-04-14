import { combineReducers }  from 'redux'

import counter from './counter'
import ha      from './ha'
import wechaty from './wechaty'

export default combineReducers({
  counter,
  ha,
  wechaty,
})
