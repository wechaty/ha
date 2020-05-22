import { createAction } from 'typesafe-actions'

import * as types from './types'

const prepareWechaty = (wechatyId: string) => ({ wechatyId })

const moMessage = createAction(types.MESSAGE_MO, prepareWechaty)()
const mtMessage = createAction(types.MESSAGE_MT, prepareWechaty)()

export {
  moMessage,
  mtMessage,
}
