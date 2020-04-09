# HAWechaty

[![NPM Version](https://badge.fury.io/js/ha-wechaty.svg)](https://www.npmjs.com/package/ha-wechaty)
[![NPM](https://github.com/wechaty/HAWechaty/workflows/NPM/badge.svg)](https://github.com/wechaty/HAWechaty/actions?query=workflow%3ANPM)

![HAWechaty](https://wechaty.github.io/HAWechaty/images/ha-wechaty.png)

<!-- markdownlint-disable MD013 -->
HAWechaty is a Load Balance for providing High Availability for Wechaty Chatbot by spreading requests across multiple WeChat individual accounts.

[![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-brightgreen.svg)](https://github.com/Wechaty/wechaty)

One two three, chatbots team up!

## Background

We have serval issues when we providing a Chatbot service, like:

1. Single Point Of Failure (SPOF)
1. Heartbeat & Keepalive

### 1 Single Point Of Failure (SPOF)

#### The Problem

Currently we have only one bot on WeChat, which means that if the bot was offline, then our service will be stopped.

#### The Solution

Use two (3 or even 4 will be better) WeChat bot at the same time, with the different wechaty-puppet providers (for example: padplus + windows).

So when an issue event has come, we can use a RR (round robin) or other very easy to implementing algorithm to make our service both load-balancable and high-available.

### 2 Heartbeat and Keepalive

1. [Heartbeat](https://en.wikipedia.org/wiki/Heartbeat_(computing))
1. [Keepalive](https://en.wikipedia.org/wiki/Keepalive)

#### The Problem

When a Wechaty bot is started and logged in, it is mostly liked to be work as expected for sending/receiving messages.

However, sometimes it might run into trouble for some unknown reason, which caused it can not work anymore, but we have nothing to know about that.

In order to check whether a Wechaty bot is available, we need to take a test on it to see if it can send & receive the message successfully.

How can archive that? It is not a good idea if we send a message to another Wechaty bot because it is not stable enough for this kind of online service.

#### The Solution

We can set up an Official Account for WeChat, with an auto-responding strategy that will reply a `dong` when it receives a `ding`.

So we let our Chatie Official Account takes the responsibility to provide this service.

## HAProxy Requirement

![QR Code for ChatieIO WeChat Official Account](docs/images/qrcode_for_gh_051c89260e5d_258.jpg)

If you want to use HAProxy, please make sure every bot account has followed the `ChatieIO` WeChat Official Account by scanning the above QR Code.

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
    token: 'hostie-token'
  }
}

const padplusWechatyOptions: WechatyOptions = {
  puppet: 'wechaty-puppet-padplus',
  puppetOptions: {
    token: 'padplus-token'
  }
}

const haWechaty = new HAWechaty({
  name: 'high-available-wechaty',
  wechatyOptionsList: [
    hostieWechathyOptions,
    padplusWechatyOptions,
  ]
})

haWechaty.start()
```

## Environment Variables

### 1 `HA_WECHATY_PUPPET`

The wechaty puppet list, seprated by a colon (`:`).

Examples:

```sh
export HA_WECHATY_PUPPET=wechaty-puppet-hostie:wechaty-puppet-padplus
```

### 2 `HA_WECHATY_PUPPET_${PROTOCOL}_TOKEN`

The `${PROTOCOL}` could be the puppet name that the Wechaty supported.

For example:

| Puppet Provider | ${PROTOCOL} | HA_WECHATY_PUPPET_${PROTOCOL}_TOKEN |
| :--- | :--- | :--- |
| wechaty-puppet-hostie  | hostie  | HA_WECHATY_PUPPET_HOSTIE_TOKEN |
| wechaty-puppet-padplus | padplus | HA_WECHATY_PUPPET_PADPLUS_TOKEN |
| wechaty-puppet-macpro  | macpro  | HA_WECHATY_PUPPET_MACPRO_TOKEN |

The token set to this environment variable will become the default value of `puppetOptions.token` when instanciating Wechaty.

To specify more tokens for a specific puppet, use a colon (`:`) to seprate them, for example:

```sh
export HA_WECHATY_PUPPET_HOSTIE_TOKEN=hostie_token_1:hostie_token_2
```

## History

### master

### v0.0.1 (Apr 2020)

This module was originally design for the project [OSSChat](https://github.com/kaiyuanshe/osschat) [#58](https://github.com/kaiyuanshe/osschat/issues/58)

1. Publish the NPM module [ha-wechaty](https://www.npmjs.com/package/ha-wechaty)

## Links

1. [RxJS recipes: ‘forkJoin’ with the progress of completion for bulk network requests in Angular](https://indepth.dev/forkjoin-with-the-progress-of-completion-for-bulk-network-requests-in-angular/)
1. [Handle multiple API requests in Angular using mergeMap and forkJoin to avoid nested subscriptions](https://levelup.gitconnected.com/handle-multiple-api-requests-in-angular-using-mergemap-and-forkjoin-to-avoid-nested-subscriptions-a20fb5040d0c)
1. [Googl Cloud - Truncated exponential backoff](https://cloud.google.com/storage/docs/exponential-backoff)
1. [Power of RxJS when using exponential backoff](https://medium.com/angular-in-depth/power-of-rxjs-when-using-exponential-backoff-a4b8bde276b0)

## Author

[Huan LI](https://github.com/huan) ([李卓桓](http://linkedin.com/in/zixia)) zixia@zixia.net

[![Profile of Huan LI (李卓桓) on StackOverflow](https://stackexchange.com/users/flair/265499.png)](https://stackexchange.com/users/265499)

## Copyright & License

* Code & Docs © 2020-now Huan LI \<zixia@zixia.net\>
* Code released under the Apache-2.0 License
* Docs released under Creative Commons
