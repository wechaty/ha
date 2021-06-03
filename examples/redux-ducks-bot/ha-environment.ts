import {
  Message,
}                     from 'wechaty'
import {
  mock,
}                     from 'wechaty-puppet-mock'
import { ContactMock } from 'wechaty-puppet-mock/dist/src/mock/mod'

import {
  CHATIE_OA_ID,
}                     from '../../src/config'

const HaEnvironment = (): mock.EnvironmentMock => {

  return function HaEnvironmentStart (mocker: mock.Mocker) {

    const [user, mary, mike] = mocker.createContacts(3) as [ContactMock, ContactMock, ContactMock]

    // Initialize WeChat system accounts
    mocker.createContact({ id: 'filehelper' })

    // Initialize Chatie service account
    const chatieio = mocker.createContact({ id: CHATIE_OA_ID })

    chatieio.on('message', msg => {
      console.info('chatieio.on(message): ', msg.text())
      if (msg.talker().id === chatieio.id) {
        return
      }
      if (msg.type() === Message.Type.Text && /^ding$/i.test(msg.text() || '')) {
        msg.listener()?.say('dong').to(msg.talker())
        // console.info('no dong any more!')
      }
    })

    mocker.scan('qrcode')
    mocker.login(user)

    mary.say('how are you?').to(user)
    user.say('fine, thank you.').to(mary)
    void mike

    let timer: undefined | NodeJS.Timer
    // timer = setInterval(() => mike.say().to(user), 10 * 1000)

    return function HaEnvironmentStop () {
      if (timer) {
        clearInterval(timer)
        timer = undefined
      }
    }
  }
}

export { HaEnvironment }
