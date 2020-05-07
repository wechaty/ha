/**
 *   Wechaty - https://github.com/wechaty/wechaty
 *
 *   @copyright 2016-2018 Huan LI <zixia@zixia.net>
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
  FileBox,
  Message,
  Wechaty,
}               from 'wechaty'

import {
  QRCodeTerminal,
  EventLogger,
}                   from 'wechaty-plugin-contrib'

import { HAWechaty } from '../src/'

import dotenv from 'dotenv'
dotenv.config()

/**
 *
 * 1. Declare your Bot!
 *
 */
const ha = new HAWechaty({
  name : 'ha-ding-dong-bot',
})

ha.use(
  EventLogger(),
  QRCodeTerminal(),
)

/**
 *
 * 2. Register event handlers for Bot
 *
 */
ha.on('message', onMessage)

/**
 *
 * 3. Start the bot!
 *
 */
ha.start()
  .catch(console.error)

/**
 *
 * 6. The most important handler is for:
 *    dealing with Messages.
 *
 */
async function onMessage (
  this: Wechaty,
  msg: Message,
) {
  console.info(msg.toString())

  if (msg.self()) {
    console.info('Message discarded because its outgoing')
    return
  }

  if (msg.age() > 2 * 60) {
    console.info('Message discarded because its TOO OLD(than 2 minutes)')
    return
  }

  if (msg.type() !== this.Message.Type.Text
    || !/^(ding|ping|bing|code)$/i.test(msg.text())
  ) {
    console.info('Message discarded because it does not match ding/ping/bing/code')
    return
  }

  /**
   * 1. reply 'dong'
   */
  await msg.say('dong')
  console.info('REPLY: dong')

  /**
   * 2. reply image(qrcode image)
   */
  const fileBox = FileBox.fromUrl('https://wechaty.github.io/wechaty/images/bot-qr-code.png')

  await msg.say(fileBox)
  console.info('REPLY: %s', fileBox.toString())

  /**
   * 3. reply 'scan now!'
   */
  await msg.say([
    'Join Wechaty Developers Community\n\n',
    'Scan now, because other Wechaty developers want to talk with you too!\n\n',
    '(secret code: wechaty)',
  ].join(''))
}

/**
 *
 * 7. Output the Welcome Message
 *
 */
const welcome = `
| __        __        _           _
| \\ \\      / /__  ___| |__   __ _| |_ _   _
|  \\ \\ /\\ / / _ \\/ __| '_ \\ / _\` | __| | | |
|   \\ V  V /  __/ (__| | | | (_| | |_| |_| |
|    \\_/\\_/ \\___|\\___|_| |_|\\__,_|\\__|\\__, |
|                                     |___/

=============== Powered by Wechaty ===============
-------- https://github.com/wechaty/wechaty --------
          Version: ${ha.version()}

I'm a bot, my superpower is talk in Wechat.

If you send me a 'ding', I will reply you a 'dong'!
__________________________________________________

Hope you like it, and you are very welcome to
upgrade me to more superpowers!

Please wait... I'm trying to login in...

`
console.info(welcome)
