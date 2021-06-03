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
import {
  WechatyOptions,
  log,
  MemoryCard,
  PuppetModuleName,
}                   from 'wechaty'

interface HaWechatyEnv {
  HA_WECHATY_PUPPET?       : string,
  HA_WECHATY_PUPPET_TOKEN? : string
}

function getWechatyOptionsListFromEnv (
  env : HaWechatyEnv,
  name   = 'ha-wechaty',
  memory = new MemoryCard(name),
): WechatyOptions[] {
  log.verbose('HAWechaty', 'getWechatyOptionsListFromEnv(%s, %s, %s)', JSON.stringify(env), name, memory)

  const wechatyOptionsList: WechatyOptions[] = []

  const puppetList = (env.HA_WECHATY_PUPPET?.split(':') || []) as PuppetModuleName[]
  log.verbose('HAWechaty', 'getWechatyOptionsListFromEnv() found %s puppet(s): %s',
    puppetList.length,
    puppetList.join(', '),
  )

  const tokenList = (env.HA_WECHATY_PUPPET_TOKEN?.split(':') || []) as string[]
  log.verbose('HAWechaty', 'getWechatyOptionsListFromEnv() found %s token(s): %s',
    tokenList.length,
    tokenList.join(', '),
  )

  if (puppetList.length !== tokenList.length) {
    throw new Error([
      'HAWechaty getWechatyOptionsListFromEnv():',
      'HA_WECHATY_PUPPET and HA_WECHATY_PUPPET_TOKEN must to be set as pairs.',
      'If you have 2 puppet, then you must have 2 token as well.',
      'No token can set to be empty, i.e. WECHATY_PUPPET_TOKEN=:',
    ].join(' '))
  }

  puppetList.forEach((puppet, i) => {
    log.verbose('HAWechaty', 'getWechatyOptionsListFromEnv() preparing puppet %s ...', puppet)

    const puppetName = `${name}<${puppet}>`
    const puppetMemory = memory.multiplex(puppetName)

    const options: WechatyOptions = {
      memory : puppetMemory.multiplex(String(i)),
      name   : puppetName + '#' + i,
      puppet,
      puppetOptions : {
        token: tokenList[i],
      },
    }
    wechatyOptionsList.push(options)
  })

  return wechatyOptionsList
}

export { getWechatyOptionsListFromEnv }
