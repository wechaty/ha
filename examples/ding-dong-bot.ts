/**
 *   Wechaty - https://github.com/wechaty/wechaty
 *
 *   @copyright 2020 Huan LI <zixia@zixia.net>
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
  QRCodeTerminal,
  EventLogger,
  DingDong,
}                   from 'wechaty-plugin-contrib'

import {
  configureHa,
}                 from '../src/'

import dotenv from 'dotenv'
dotenv.config()

/**
 *
 * 1. Declare your Bot!
 *
 */
const ha = configureHa()

ha.use(
  EventLogger(),
  QRCodeTerminal(),
  DingDong(),
)

ha.once('login', () => setInterval(
  async () => {
    const room = await ha.roomLoad('17376996519@chatroom') // Heartbeat Room
    if (!room) {
      console.error('can not found room for testing!')
      return
    }
    await room.say('HA Wechaty')
  },
  5 * 1000,
))

/**
 *
 * 3. Start the bot!
 *
 */
ha.start()
  .catch(console.error)
