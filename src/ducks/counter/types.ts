import { DeepReadonly } from 'utility-types'

export const MESSAGE_MO = 'HAWechaty/counter/MESSAGE_MO'
export const MESSAGE_MT = 'HAWechaty/counter/MESSAGE_MT'

export type State = DeepReadonly<{
  mo: number,
  mt: number,
}>
