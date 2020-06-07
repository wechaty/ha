/**
 *   Wechaty Open Source Software - https://github.com/wechaty
 *
 *   @copyright 2016 Huan LI (李卓桓) <https://github.com/huan>, and
 *                   Wechaty Contributors <https://github.com/wechaty>.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import { Wechaty }    from 'wechaty'

import { HAWechaty }  from '../'

import { State } from './reducers'

const isWechatyAvailable = (state: State) => (wechatyOrId: string | Wechaty): boolean => {
  if (wechatyOrId instanceof Wechaty) {
    wechatyOrId = wechatyOrId.id
  }
  return !!(state.availability[wechatyOrId])
}

const isHaAvailable = (state: State) => (haOrId?: string | HAWechaty): boolean => {
  if (!haOrId) {
    return Object.values(state.availability)
      .filter(Boolean)
      .length > 0
  }

  if (haOrId instanceof HAWechaty) {
    haOrId = haOrId.id
  }

  const isWithHa    = (wechatyId: string) => state.cluster[wechatyId] === haOrId
  const isAvailable = (wechatyId: string) => !!(state.availability[wechatyId])

  return Object.keys(state.cluster)
    .filter(isWithHa)
    .filter(isAvailable)
    .length > 0
}

const getHaByWechaty = (state: State) => (wechatyOrId: string | Wechaty): string => {
  if (wechatyOrId instanceof Wechaty) {
    wechatyOrId = wechatyOrId.id
  }

  const haId = state.cluster[wechatyOrId]
  if (!haId) {
    throw new Error('no haId')
  }
  return haId
}

const isHaAvailableByWechaty = (state: State) => (wechatyOrId: string | Wechaty): boolean => {
  const haId = getHaByWechaty(state)(wechatyOrId)
  return isHaAvailable(state)(haId)
}

export {
  getHaByWechaty,
  isHaAvailable,
  isHaAvailableByWechaty,
  isWechatyAvailable,
}
