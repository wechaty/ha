import { createAction } from 'typesafe-actions'

import types from './types'

const moMessage = createAction(types.MESSAGE_MO)()
const mtMessage = createAction(types.MESSAGE_MT)()

export default {
  moMessage,
  mtMessage,
}
