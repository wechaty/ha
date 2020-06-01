import { combineEpics } from 'redux-observable'

import { epics as ha }       from '../../src/api/'
import { epics as wechaty }  from '../../src/wechaty-redux/api'
import { epics as counter }  from '../../src/wechaty-ducks-counter/'

export default combineEpics(
  ...Object.values(ha),
  ...Object.values(wechaty),
  ...Object.values(counter),
)
