/**
 * Query Interface of the CQRS Pattern
 *  Command Query Responsibility Segregation (CQRS)
 *
 * Huan https://github.com/huan May 2020
 */
import { State } from './reducers'
import {
  getWechaty,
}               from '../wechaty-redux'

export const getUserName = (wechatyId: string, contactId: string) => getWechaty(wechatyId)
  .Contact.load(contactId)
  .name()

function getStatus (
  state     : State,
  wechatyId : string,
) {
  if (wechatyId in state) {
    return state[wechatyId]
  }
  return {}
}

export {
  getStatus,
}
