// import { TestScheduler } from 'rxjs/testing'
// import configureMockStore from 'redux-mock-store'

// import { test } from 'tstest'

// import { Wechaty } from 'wechaty'

// import rxjs       from 'rxjs'
// import operators  from 'rxjs/operators'

// import actions  from './actions'
// import epics    from './epics'

// // void TestScheduler
// // void Wechaty
// // void actions
// // void epics

// const scheduler = new TestScheduler((actual, expected) => {
//   if (JSON.stringify(actual) !== JSON.stringify(expected)) {
//     throw new Error(`Failing test

// actual: ${JSON.stringify(actual, null, 2)}

// expected: ${JSON.stringify(expected, null, 2)}
//     `)
//   }
// })

// // TODO: read https://stackblitz.com/edit/typescript-hqtvgk?file=index.ts

// test('should dispatch only one finishRequestText despite many startRequestText', async t => {
//   const fakeFetchResponse: string = 'fake response'
//   // @ts-ignore: this is valid. See https://github.com/facebook/jest/issues/936#issuecomment-214556122
//   rxjs.race = jest.fn((...observables: Array<Observable<AllActions>>) => observables[0])
//   // @ts-ignore this is valid also
//   FF.fromFetch = jest.fn(() => rxjs.of({ text: () => {
//     return rxjs.of(fakeFetchResponse).pipe(
//       operators.delay(5),
//     )
//   }}))
//   const testScheduler = new TestScheduler((actual, expected) => {
//     // somehow assert the two objects are equal
//     // e.g. with chai `expect(actual).deep.equal(expected)`
//     expect(actual).toStrictEqual(expected)
//     done()
//   })
//   //                                12345   67890
//   const inputMarble: string =  '1ms -abc(d|)--------'
//   //                                12345   67890
//   const outputMarble: string = '1ms -----   ----(d|)'
//                                               // ^ it is normal to have this parenthesis because
//                                               //   'complete' event and d are synchronous
//                                               //   this position is the 10th frame

//   // https://github.com/redux-observable/redux-observable/issues/620#issuecomment-466736543
//   testScheduler.run(({ hot, cold, expectObservable }) => {
//     const actionInput$: ColdObservable<StartRequestTextAction> = cold(inputMarble, {
//       a: { type: C.START_REQUEST_TEXT },
//       b: { type: C.START_REQUEST_TEXT },
//       c: { type: C.START_REQUEST_TEXT },
//       d: { type: C.START_REQUEST_TEXT },
//     })
//     const action$: ActionsObservable<AllActions> = new ActionsObservable(actionInput$) as ActionsObservable<AllActions>

//     const stateInput$: HotObservable<RootState> = hot('-a', {
//       a: initialState,
//     })
//     const state$ = new StateObservable(stateInput$, initialState)

//     const output$ = startRequestTextEpic(action$, state$, {})

//     expectObservable(output$).toBe(outputMarble, {
//       d: {
//         type: C.FINISH_REQUEST_TEXT,
//         text: fakeFetchResponse,
//       }
//     })
//   })
// })

// test('epics', async t => {
//   const testScheduler = new TestScheduler((actual, expected) => {
//     t.deepEqual(actual, expected, 'actual match expected')
//   })

//   const wechaty = new Wechaty()

//   testScheduler.run(({ hot, cold, expectObservable }) => {
//     const action$ = hot('-a', {
//       a: actions.recoverWechaty(wechaty),
//     })
//     const state$ = null
//     const dependencies = {}

//     const output$ = epics.dongEmitterEpic(action$, state$, dependencies)

//     expectObservable(output$).toBe('---a', {
//       a: {
//         response: {
//           url: 'https://api.github.com/users/123',
//         },
//         type: 'FETCH_USER_FULFILLED',
//       },
//     })
//   })

// })

// test('store', async t => {
//   const middlewares = [] as any[]
//   const mockStore = configureMockStore(middlewares)

//   // You would import the action from your codebase in a real scenario
//   const addTodo = () => ({ type: 'ADD_TODO' })

//   test('should dispatch action', async () => {

//     // Initialize mockstore with empty state
//     const initialState = {}
//     const store = mockStore(initialState)

//     // Dispatch the action
//     store.dispatch(addTodo())

//     // Test if your store dispatched the expected actions
//     const actions = store.getActions()
//     const expectedPayload = { type: 'ADD_TODO' }
//     t.deepEqual(actions, [expectedPayload], 'actions should be expected')
//   })
// })
