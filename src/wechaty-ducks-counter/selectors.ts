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
import { State } from './reducers'

const getMo = (state: State) => (wechatyId?: string) => {
  if (wechatyId) {
    return state.mo[wechatyId] || 0
  }
  const moCounterList = Object.values(state.mo).filter(Boolean) as number[]
  return moCounterList.reduce((acc, cur) => acc + cur, 0)
}
const getMt = (state: State) => (wechatyId?: string) => {
  if (wechatyId) {
    return state.mt[wechatyId] || 0
  }
  const mtCounterList = Object.values(state.mt).filter(Boolean) as number[]
  return mtCounterList.reduce((acc, cur) => acc + cur, 0)
}

export {
  getMo,
  getMt,
}
