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
  QRCodeTerminal,
  EventLogger,
  DingDong,
}                  from 'wechaty-plugin-contrib'
import { log }      from 'wechaty'

import { configureHa } from '../src/mod.js'

import dotenv from 'dotenv'
dotenv.config()

/**
 *
 * 1. Declare your Bot!
 *
 */
const ha = await configureHa({
  reduxDevTools: 'remote',
  remoteReduxDevToolsOptions: {
    hostname : 'localhost',
    maxAge   : 500,
    port     : 8000,
    realtime : true,
  },
})

ha.use(
  EventLogger(),
  QRCodeTerminal(),
  DingDong(),
)

const ROOM_ID = '17376996519@chatroom'
let counter = 0

ha.once('login', () => setInterval(ha.wrapAsync(
  async () => {
    const room = await ha.Room.find({ id: ROOM_ID })
    if (room) {
      await room.say('ding #' + counter++ + ' from HA Wechaty ding-dong-bot')
    } else {
      log.error('ding-dong-bot', 'Room.find(%s) not found', ROOM_ID)
    }
  },
), 5 * 1000))

/**
 *
 * 3. Start the bot!
 *
 */
ha.start()
  .catch(console.error)
