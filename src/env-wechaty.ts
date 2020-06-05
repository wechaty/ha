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
  Wechaty,
  WechatyOptions,
  log,
}                   from 'wechaty'

export function envWechaty (
  options: WechatyOptions,
) {
  log.verbose('HAWechaty', 'envWechaty(%s)', JSON.stringify(options))

  const wechatyList: Wechaty[] = []

  const haWechatyPuppet = process.env.HA_WECHATY_PUPPET || ''

  const wechatyPuppetList = haWechatyPuppet
    .split(':')
    .filter(v => !!v)
    .map(v => v.toUpperCase())
    .map(v => v.replace(/-/g, '_'))

  log.verbose('HAWechaty', 'envWechaty() HA_WECHATY_PUPPET="%s"', haWechatyPuppet)
  log.verbose('HAWechaty', 'envWechaty() found %s puppet(s): %s',
    wechatyPuppetList.length,
    wechatyPuppetList.join(', '),
  )

  if (wechatyPuppetList.includes('WECHATY_PUPPET_MOCK')) {
    wechatyList.push(
      new Wechaty({
        ...options,
        puppet: 'wechaty-puppet-mock',
      }),
    )
  }

  if (wechatyPuppetList.includes('WECHATY_PUPPET_HOSTIE')
      && process.env.HA_WECHATY_PUPPET_HOSTIE_TOKEN
  ) {
    wechatyList.push(
      new Wechaty({
        ...options,
        puppet: 'wechaty-puppet-hostie',
        puppetOptions: {
          token: process.env.HA_WECHATY_PUPPET_HOSTIE_TOKEN,
        },
      }),
    )
  }

  if (wechatyPuppetList.includes('WECHATY_PUPPET_PADPLUS')
      && process.env.HA_WECHATY_PUPPET_PADPLUS_TOKEN
  ) {
    // https://github.com/wechaty/wechaty-puppet-padplus#how-to-emit-the-message-that-you-sent
    process.env.PADPLUS_REPLAY_MESSAGE = 'true'

    wechatyList.push(
      new Wechaty({
        ...options,
        puppet: 'wechaty-puppet-padplus',
        puppetOptions: {
          token: process.env.HA_WECHATY_PUPPET_PADPLUS_TOKEN,
        },
      }),
    )
  }

  return wechatyList
}
