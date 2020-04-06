# HAWechaty

[![NPM Version](https://badge.fury.io/js/ha-wechaty.svg)](https://www.npmjs.com/package/ha-wechaty)
[![NPM](https://github.com/wechaty/HAWechaty/workflows/NPM/badge.svg)](https://github.com/wechaty/HAWechaty/actions?query=workflow%3ANPM)

![HAWechaty](https://wechaty.github.io/HAWechaty/images/ha-wechaty.png)

<!-- markdownlint-disable MD013 -->
HAWechaty is a Load Balance for providing High Availability for Wechaty Chatbot by spreading requests across multiple WeChat individual accounts.

[![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-brightgreen.svg)](https://github.com/Wechaty/wechaty)

One two three, chatbots team up!

## The Problem

Currently we have only one bot on WeChat, which means that if the bot was offline, then our service will be stopped.

## The Solution

Use two (3 or even 4 will be better) WeChat bot at the same time, with the different wechaty-puppet providers (for example: padplus + windows).

So when an issue event has come, we can use a RR (round robin) or other very easy to implementing algorithm to make our service both load-balancable and high-available.

## Usage

```ts
import {
  HAWechaty,
}                   from 'ha-wechaty'
import {
  WechatyOptions,
}                   from 'wechaty'

const hostieWechatyOptions: WechatyOptions = {
  puppet: 'wechaty-puppet-hostie',
  puppetOptions: {
    token: 'hostie-secret'
  }
}

const padplusWechatyOptions: WechatyOptions = {
  puppet: 'wechaty-puppet-padplus',
  puppetOptions: {
    token: 'padplus-secret'
  }
}

const haWechaty = new HAWechaty({
  wechatyOptionsList: [
    hostieWechathyOptions,
    padplusWechatyOptions,
  ]
})

haWechaty.start()
```

## Environment Variables

### 1 `HA_WECHATY_PUPPET`

The wechaty puppet list, seprated by `:`.

Examples:

```sh
export HA_WECHATY_PUPPET=wechaty-puppet-hostie:wechaty-puppet-padplus
```

### 2 `HA_WECHATY_PUPPET_${PROTOCOL}_TOKEN`

The `${PROTOCOL}` could be the puppet name that the Wechaty supported.

For example:

| Puppet Provider | Protocol | HA_WECHATY_PUPPET_${PROTOCOL}_TOKEN |
| :--- | :--- |
| wechaty-puppet-hostie  | hostie     | HA_WECHATY_PUPPET_HOSTIE_TOKEN |
| wechaty-puppet-padplus | padplus    | HA_WECHATY_PUPPET_PADPLUS_TOKEN |
| wechaty-puppet-hostie  | puppeteer  | HA_WECHATY_PUPPET_PUPPETEER_TOKEN |

The token set to this environment variable will become the default value of `puppetOptions.token` when instanciating Wechaty.

To specify more tokens for a specific puppet, use `:` to seprate them, for example:

```sh
export HA_WECHATY_PUPPET_HOSTIE_TOKEN=hostie_secret_1:hostie_secret_2
```

## History

### master

### v0.0.1 (Apr 2020)

This module was design for the project [OSSChat](https://github.com/kaiyuanshe/osschat) [#58](https://github.com/kaiyuanshe/osschat/issues/58)

1. Publish the NPM module [ha-wechaty](https://www.npmjs.com/package/ha-wechaty)

## Author

[Huan LI](https://github.com/huan) ([李卓桓](http://linkedin.com/in/zixia)) zixia@zixia.net

[![Profile of Huan LI (李卓桓) on StackOverflow](https://stackexchange.com/users/flair/265499.png)](https://stackexchange.com/users/265499)

## Copyright & License

* Code & Docs © 2020-now Huan LI \<zixia@zixia.net\>
* Code released under the Apache-2.0 License
* Docs released under Creative Commons
