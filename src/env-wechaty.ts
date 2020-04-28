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

  if (wechatyPuppetList.includes('WECHATY_PUPPET_MOCK')
      && process.env.HA_WECHATY_PUPPET_MOCK_TOKEN
  ) {
    wechatyList.push(
      new Wechaty({
        ...options,
        puppet: 'wechaty-puppet-mock',
        puppetOptions: {
          token: process.env.HA_WECHATY_PUPPET_MOCK_TOKEN,
        },
      }),
    )
  }

  return wechatyList
}
