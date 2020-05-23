/**
 * Query Interface of the CQRS Pattern
 *  Command Query Responsibility Segregation (CQRS)
 *
 * Huan https://github.com/huan May 2020
 */
import { State } from './reducers'

const getQRCode      = (state: State) => (wechatyId: string) => state[wechatyId]?.qrcode
const getUserPayload = (state: State) => (wechatyId: string) => state[wechatyId]?.user
const isLoggedIn     = (state: State) => (wechatyId: string) => state[wechatyId]?.user !== undefined

export {
  getQRCode,
  getUserPayload,
  isLoggedIn,
}
