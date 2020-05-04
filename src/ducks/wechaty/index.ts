import reducer from './reducers'

import * as epics      from './epics'
import * as actions    from './actions'
import * as selectors  from './selectors'
import * as types      from './types'
import * as operations from './operations'

export {
  actions,
  epics,
  selectors,
  types,
  operations,
}

export default reducer
