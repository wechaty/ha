import reducer from './reducers'

import epics      from './epics'
import actions    from './actions'
import selectors  from './selectors'
import * as types      from './types'
import operations from './operations'

export {
  actions,
  epics,
  selectors,
  types,
  operations,
}

export default reducer
