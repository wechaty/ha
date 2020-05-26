// import { Store } from 'redux'

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

// export const getSelectors =  (store: Store) => (mountPoint?: string) => {
//   if (!mountPoint) {
//     mountPoint = 'default' // FIXME!!!!
//   }

//   return ({
//     isHAAvailable: selectors.isHAAvailable(store.getState()[mountPoint]),
//   })
// }

export default reducer
