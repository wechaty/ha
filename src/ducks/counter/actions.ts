import { createAction } from 'typesafe-actions'

import * as types from './types'

const moMessage = createAction(types.MESSAGE_MO)()
const mtMessage = createAction(types.MESSAGE_MT)()

export {
  moMessage,
  mtMessage,
}
