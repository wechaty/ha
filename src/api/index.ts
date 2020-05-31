import reducer from './reducers'

import * as epics     from './epics'
import * as actions   from './actions'
import * as selectors from './selectors'
import * as types     from './types'

export {
  actions,
  epics,
  selectors,
  types,
}

export default reducer

export type State = ReturnType<typeof reducer>
