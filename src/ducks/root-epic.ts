import { combineEpics } from 'redux-observable'

import * as haEpics from './ha/epics'

export default combineEpics(...Object.values(haEpics))
