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
import type { HAWechaty } from './ha-wechaty.js'

const instances = new Map<string, HAWechaty>()

const getHa = (id: string) => {
  const ha = instances.get(id)
  if (!ha) {
    throw new Error('no HA Wechaty instance for id ' + id)
  }
  return ha
}

const addHa = (haWechaty: HAWechaty) => {
  if (instances.has(haWechaty.id)) {
    throw new Error('HAWechaty with id: ' + haWechaty.id + ' has been already set before, and can not be added twice.')
  }
  instances.set(haWechaty.id, haWechaty)
}

export {
  getHa,
  addHa,
}
