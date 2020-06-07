import {
  Message,
}                     from 'wechaty'
import {
  MockEnvironment,
  Mocker,
}                     from 'wechaty-puppet-mock'

import {
  CHATIE_OA_ID,
}                     from '../../src/config'

const HaEnvironment = (): MockEnvironment => {

  return function HaEnvironmentStart (mocker: Mocker) {

    const [ user, mary, mike ] = mocker.createContacts(3)

    // Initialize WeChat system accounts
    mocker.createContact({ id: 'filehelper' })

    // Initialize Chatie service account
    const chatieio = mocker.createContact({ id: CHATIE_OA_ID })

    chatieio.on('message', msg => {
      console.info('chatieio1.on(message): ', msg.text())
      if (msg.self()) {
        return
      }
      if (msg.type() === Message.Type.Text && /^ding$/i.test(msg.text() || '')) {
        msg.listener()?.say('dong').to(msg.talker())
      }
    })

    mocker.scan('qrcode')
    mocker.login(user)

    mary.say('how are you?').to(user)
    user.say('fine thank you.').to(mary)
    void mike

    const timer = setInterval(() => mike.say().to(user), 10 * 1000)

    return function HaEnvironmentStop () {
      clearInterval(timer)
    }
  }
}

export { HaEnvironment }
