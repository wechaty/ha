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
// #!/usr/bin/env ts-node

// import {
//   test,
//   sinon,
// }             from 'tstest'

// import {
//   TestScheduler,
// }           from 'rxjs/testing/'

// import {
//   map,
// }           from 'rxjs/operators'

// import {
//   Message, Wechaty,
// }           from 'wechaty'

// import {
//   CHATIE_OA_ID,
//   DING,
//   DONG,
//   switchSuccess,
//   isChatieOA,
//   message$,
// }                   from './heartbeat$'

// test('switchSuccess()', async t => {
//   const TRUE = true
//   const TRUE_EXPECTED = true
//   t.equal(switchSuccess(TRUE), TRUE_EXPECTED, 'should return true for true')

//   const PENDING = 'pending'
//   const PENDING_EXPECTED = false
//   t.equal(switchSuccess(PENDING), PENDING_EXPECTED, 'should return false from pending')
// })

// test('isChatieOA()', async t => {
//   const sandbox = sinon.sandbox.create()

//   const MESSAGE_OA = Message.load('xx')
//   sandbox.stub(MESSAGE_OA, 'from').returns({ id: CHATIE_OA_ID } as any)
//   t.equal(isChatieOA(MESSAGE_OA), true, 'should be true for ChatieOA message')

//   const MESSAGE_NOT_OA = Message.load('yy')
//   sandbox.stub(MESSAGE_OA, 'from').returns({ id: 'fdasfasd' } as any)
//   t.equal(isChatieOA(MESSAGE_NOT_OA), false, 'should be false for non ChatieOA message')

//   sandbox.restore()
// })

// test('message$()', async t => {
//   const scheduler = new TestScheduler((actual, expected) => {
//     t.deepEqual(actual, expected, 'the marbals of actual is expected')
//   })

//   // (wechaty: Wechaty) => fromEvent<Message>(wechaty, 'message').pipe(filter(notSelf))
//   const sandbox = sinon.createSandbox()
//   const wechaty = new Wechaty()
//   const message = wechaty.Message.load('aaa')
//   sandbox.stub(message, 'self').returns(false)

//   scheduler.run(m => {
//     const values = { a: 1, b: 2, c: 3, x: 2, y: 4, z: 6 }
//     const source$ = m.cold('-a-b-c-|', values)
//     const result$ = source$.pipe(map(x => x * 2))
//     const expected = '-x-y-z-|'
//     m.expectObservable(result$).toBe(expected, values)
//   })

//   sandbox.restore()
// })

// test('should multiply by "2" each value emitted', async t => {
//   const scheduler = new TestScheduler((actual, expected) => {
//     t.deepEqual(actual, expected, 'the marbals of actual is expected')
//   })

//   scheduler.run(m => {
//     const values = { a: 1, b: 2, c: 3, x: 2, y: 4, z: 6 }
//     const source$ = m.cold('-a-b-c-|', values)
//     const result$ = source$.pipe(map(x => x * 2))
//     const expected = '-x-y-z-|'
//     m.expectObservable(result$).toBe(expected, values)
//   })
// })
