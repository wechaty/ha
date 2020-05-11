import { combineEpics } from 'redux-observable'

import { epics as ha }       from '../ducks/'
import { epics as wechaty }  from '../wechaty-redux/ducks/'
import { epics as counter }  from '../wechaty-ducks-counter/'

export default combineEpics(
  ...Object.values(ha),
  ...Object.values(wechaty),
  ...Object.values(counter),
)
