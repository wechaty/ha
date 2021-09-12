#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

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
// import {
//   test,
//   sinon,
// }             from 'tstest'

// import {
//   HAWechaty,
//   // HAWechatyOptions,
// }                               from '../src/.js'

// test('integration testing', async t => {
//   const TOKEN    = 'test_token'
//   const ENDPOINT = '0.0.0.0:8788'
//   const DING     = 'ding_data'

//   /**
//    * Puppet in Puppet Server
//    */
//   const PUPPET = new PuppetMock()
//   const spyStart = sinon.spy(PUPPET, 'start')
//   const spyOn    = sinon.spy(PUPPET, 'on')
//   const spyDing  = sinon.spy(PUPPET, 'ding')

//   /**
//    * Puppet Server Server
//    */
//   const serverOptions = {
//     endpoint : ENDPOINT,
//     puppet   : PUPPET,
//     token    : TOKEN,
//   } as PuppetServerOptions

//   const serviceServer = new PuppetServer(serverOptions)
//   await serviceServer.start()

//   /**
//    * Puppet Puppet Server Client
//    */
//   const puppetOptions = {
//     endpoint: ENDPOINT,
//     token: TOKEN,
//   } as PuppetOptions

//   const puppetService = new PuppetService(puppetOptions)
//   await puppetService.start()

//   t.ok(spyStart.called, 'should called the puppet-service server start() function')

//   const future = new Promise((resolve, reject) => {
//     puppetService.on('dong', resolve)
//     puppetService.on('error', reject)
//   })

//   puppetService.ding(DING)
//   const result = await future

//   t.ok(spyOn.called,    'should called the puppet-service server on() function')
//   t.ok(spyDing.called,  'should called the puppet-service server ding() function')

//   t.equal(result, DING, 'should get a successful roundtrip for ding')

//   /**
//    * Stop
//    *  1. Puppet in Puppet Server
//    *  2. Puppet Server Service
//    *  3. Puppet Puppet Server Client
//    *
//    */
//   await puppetService.stop()
//   await serviceServer.stop()
// })

export {}
