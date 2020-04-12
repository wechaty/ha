import { combineReducers }  from 'redux'

import counterReducer from './counter'
import haReducer      from './ha'
import wechatyReducer from './wechaty'

export default combineReducers({
  counter : counterReducer,
  ha      : haReducer,
  wechaty : wechatyReducer,
})
