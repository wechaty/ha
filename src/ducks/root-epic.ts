import { combineEpics } from 'redux-observable'

import { epics as ha }       from './ha/'
import { epics as wechaty }  from './wechaty/'

export default combineEpics(
  ...Object.values(ha),
  ...Object.values(wechaty),
)
