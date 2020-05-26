import { combineEpics } from 'redux-observable'

import { epics as ha }       from '../api/'
import { epics as wechaty }  from '../wechaty-redux/api'
import { epics as counter }  from '../wechaty-ducks-counter/'

export default combineEpics(
  ...Object.values(ha),
  ...Object.values(wechaty),
  ...Object.values(counter),
)
