# HAWechaty

[![NPM Version](https://img.shields.io/npm/v/ha-wechaty?color=brightgreen)](https://www.npmjs.com/package/ha-wechaty)
[![NPM](https://github.com/wechaty/ha-wechaty/workflows/NPM/badge.svg)](https://github.com/wechaty/ha-wechaty/actions?query=workflow%3ANPM)

![HAWechaty](https://wechaty.github.io/ha-wechaty/images/ha-wechaty.png)

<!-- markdownlint-disable MD013 -->
HAWechaty is a Load Balance for providing High Availability for Wechaty Chatbot by spreading requests across multiple WeChat individual accounts.

[![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-brightgreen.svg)](https://github.com/Wechaty/wechaty)

One two three, chatbots team up!

## Background

How to delivering high levels of [SLA uptime](https://www.vxchnge.com/blog/uptime-statistics-impact-business)?

### The Problem of Single Point Of Failure (SPOF)

We have serval issues when we providing a Chatbot service, like:

1. Single Point Of Failure (SPOF)
1. Heartbeat & Keepalive

### 1 Single Point Of Failure (SPOF)

#### The Problem #1

Currently we have only one bot on WeChat, which means that if the bot was offline, then our service will be stopped.

#### The Solution #1

Use two (3 or even 4 will be better) WeChat bot at the same time, with the different wechaty-puppet providers (for example: padplus + windows).

So when an issue event has come, we can use a RR (round robin) or other very easy to implementing algorithm to make our service both load-balancable and high-available.

### 2 Heartbeat and Keepalive

1. [Heartbeat](https://en.wikipedia.org/wiki/Heartbeat_(computing))
1. [Keepalive](https://en.wikipedia.org/wiki/Keepalive)

#### The Problem #2

When a Wechaty bot is started and logged in, it is mostly liked to be work as expected for sending/receiving messages.

However, sometimes it might run into trouble for some unknown reason, which caused it can not work anymore, but we have nothing to know about that.

In order to check whether a Wechaty bot is available, we need to take a test on it to see if it can send & receive the message successfully.

How can archive that? It is not a good idea if we send a message to another Wechaty bot because it is not stable enough for this kind of online service.

#### The Solution #2

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

await haWechaty.start()
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

## Development

### Redux Remote DevTools

```sh
npm run redux-devtools
```

## History

### master

### v0.0.1 (Apr 2020)

This module was originally design for the project [OSSChat](https://github.com/kaiyuanshe/osschat) [#58](https://github.com/kaiyuanshe/osschat/issues/58)

1. Publish the NPM module [ha-wechaty](https://www.npmjs.com/package/ha-wechaty)

## Links

### Back Off Alghorithm

1. [Googl Cloud - Truncated exponential backoff](https://cloud.google.com/storage/docs/exponential-backoff)
1. [Power of RxJS when using exponential backoff](https://medium.com/angular-in-depth/power-of-rxjs-when-using-exponential-backoff-a4b8bde276b0)

### Redux

1. [Redux Best Practices](https://medium.com/@kylpo/redux-best-practices-eef55a20cc72#.e8gil0ncl)
1. [Typesafe utilities for "action-creators" in Redux / Flux Architecture](https://github.com/piotrwitek/typesafe-actions)
1. [createAsyncEpic - Generic redux-observable factory handling async-actions - #162](https://github.com/piotrwitek/typesafe-actions/issues/162)

### RxJS Testing

1. [A better approach for testing your Redux code](https://blog.henriquebarcelos.dev/a-better-approach-for-testing-your-redux-code-ck3dnpqnu00uro4s178b8aw3e)
1. [Marble testing with RxJS testing utils - You don’t need a third-party library for marble testing](https://medium.com/@kevinkreuzer/marble-testing-with-rxjs-testing-utils-3ae36ac3346a)
1. [Testing RxJS Code with Marble Diagrams](https://github.com/ReactiveX/rxjs/blob/6.5.4/docs_app/content/guide/testing/marble-testing.md)
1. [Extensive introduction to why and how you might want to use and test redux-observable](https://9oelm.github.io/2020-01-24--Fundamental-yet-extensive-introduction-to-why-and-how-you-might-want-to-use-redux-observable-for-async-actions/)
1. [Writing Better Marble Tests for Redux Observable and TypeScript](https://itnext.io/better-marble-test-70c7676a1e2)

### RxJS Operators

1. [RxJS recipes: ‘forkJoin’ with the progress of completion for bulk network requests in Angular](https://indepth.dev/forkjoin-with-the-progress-of-completion-for-bulk-network-requests-in-angular/)
1. [Handle multiple API requests in Angular using mergeMap and forkJoin to avoid nested subscriptions](https://levelup.gitconnected.com/handle-multiple-api-requests-in-angular-using-mergemap-and-forkjoin-to-avoid-nested-subscriptions-a20fb5040d0c)
1. [Fun with RxJS's groupBy](dataquarium.io/blog/fun-with-rxjs-groupby/)
1. [Here is what I’ve learn about groupBy operator by reading RxJS sources](https://medium.com/angular-in-depth/those-hidden-gotchas-within-rxjs-7d5c57406041)

## Author

[Huan LI](https://github.com/huan) ([李卓桓](http://linkedin.com/in/zixia)) zixia@zixia.net

[![Profile of Huan LI (李卓桓) on StackOverflow](https://stackexchange.com/users/flair/265499.png)](https://stackexchange.com/users/265499)

## Copyright & License

* Code & Docs © 2020-now Huan LI \<zixia@zixia.net\>
* Code released under the Apache-2.0 License
* Docs released under Creative Commons
