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
  HA_WECHATY_PUPPET: string,
  HA_WECHATY_PUPPET_HOSTIE_TOKEN?  : string
  HA_WECHATY_PUPPET_PADPLUS_TOKEN? : string
}

const toSnakeUpperCase = (str: string) => str.toUpperCase().replace(/-/g, '_')

function envWechaty (
  env     : HaWechatyEnv,
  name?   : string,
  memory? : MemoryCard,
): WechatyOptions[] {
  log.verbose('HAWechaty', 'envWechaty(%s, %s, %s)', JSON.stringify(env), name, memory)

  if (!name) {
    name = 'ha-wechaty'
  }
  if (!memory) {
    memory = new MemoryCard(name)
  }

  const wechatyOptionsList: WechatyOptions[] = []

  const puppetList = env.HA_WECHATY_PUPPET.split(':') as PuppetModuleName[]
  log.verbose('HAWechaty', 'envWechaty() found %s puppet(s): %s',
    puppetList.length,
    puppetList.join(','),
  )

  for (const puppet of puppetList) {
    log.verbose('HAWechaty', 'envWechaty() preparing puppet %s ...', puppet)

    const puppetName = `${name}<${puppet}>`
    const puppetMemory = memory.multiplex(puppetName)

    // wechaty-puppet-hostie -> HA_ WECHATY_PUPPET_HOSTIE _TOKEN
    const haPuppetTokenName = [
      'HA_',
      toSnakeUpperCase(puppet),
      '_TOKEN',
    ].join('')

    const haPuppetToken = env[haPuppetTokenName as keyof HaWechatyEnv]
    const puppetTokenList = haPuppetToken?.split(':') || []

    for (let i = 0; i < puppetTokenList.length; i++) {
      const options: WechatyOptions = {
        memory : puppetMemory.multiplex(String(i)),
        name   : puppetName + '#' + i,
        puppet,
        puppetOptions : {
          token: puppetTokenList[i],
        },
      }
      wechatyOptionsList.push(options)
    }
  }

  return wechatyOptionsList
}

export { envWechaty }
