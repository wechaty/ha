#!/usr/bin/env ts-node

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
// }                               from '../src/'

// test('integration testing', async (t) => {
//   const TOKEN    = 'test_token'
//   const ENDPOINT = '0.0.0.0:8788'
//   const DING     = 'ding_data'

//   /**
//    * Puppet in Hostie
//    */
//   const PUPPET = new PuppetMock()
//   const spyStart = sinon.spy(PUPPET, 'start')
//   const spyOn    = sinon.spy(PUPPET, 'on')
//   const spyDing  = sinon.spy(PUPPET, 'ding')

//   /**
//    * Hostie Server
//    */
//   const serverOptions = {
//     endpoint : ENDPOINT,
//     puppet   : PUPPET,
//     token    : TOKEN,
//   } as PuppetServerOptions

//   const hostieServer = new PuppetServer(serverOptions)
//   await hostieServer.start()

//   /**
//    * Puppet Hostie Client
//    */
//   const puppetOptions = {
//     endpoint: ENDPOINT,
//     token: TOKEN,
//   } as PuppetOptions

//   const puppetHostie = new PuppetHostie(puppetOptions)
//   await puppetHostie.start()

//   t.ok(spyStart.called, 'should called the hostie server start() function')

//   const future = new Promise((resolve, reject) => {
//     puppetHostie.on('dong', resolve)
//     puppetHostie.on('error', reject)
//   })

//   puppetHostie.ding(DING)
//   const result = await future

//   t.ok(spyOn.called,    'should called the hostie server on() function')
//   t.ok(spyDing.called,  'should called the hostie server ding() function')

//   t.equal(result, DING, 'should get a successful roundtrip for ding')

//   /**
//    * Stop
//    *  1. Puppet in Hostie
//    *  2. Hostie Service
//    *  3. Puppet Hostie Client
//    *
//    */
//   await puppetHostie.stop()
//   await hostieServer.stop()
// })
