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
/// <reference path="./types.d.ts" />

import {
  applyMiddleware,
  createStore,
  compose,
}                           from 'redux'
import {
  composeWithDevTools,
}                           from 'remote-redux-devtools'
import {
  createEpicMiddleware,
  Epic,
}                           from 'redux-observable'
import {
  // ActionType,
  // StateType,
  RootState,
  RootAction,
  // createAsyncAction,
}                           from 'typesafe-actions'

// import rootAction   from './root-action'
import rootReducer  from './root-reducer'
import rootEpic     from './root-epic'

export interface Dependency {}
const dependencies = {} as Dependency

export type RootEpic = Epic<
  RootAction,
  RootAction,
  RootState,
  Dependency
>

export type VoidEpic = Epic<
  RootAction,
  never,        // forbidden to emit new actions
  RootState,
  Dependency
>

/**
 * Store
 */
const epicMiddleware = createEpicMiddleware<
  RootAction,
  RootAction,
  RootState,
  Dependency
>({
  dependencies,
})

// rehydrate state on app start
const initialState = {}

const composeEnhancers = compose(
  composeWithDevTools({
    hostname : 'localhost',
    port     : 8000,
    realtime : true,
    trace: true,
  } as any),
)

// create store
const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(
    applyMiddleware(
      epicMiddleware,
    ),
  ),
)

epicMiddleware.run(rootEpic)

export default store

/**
 * Epic
 *
 *  Adding New Epics Asynchronously/Lazily
 *    https://redux-observable.js.org/docs/recipes/AddingNewEpicsAsynchronously.html
 */
// export const epic$ = new BehaviorSubject(combineEpics(
//   wechatyEpic,
// ))

// Huan(20200404) FIXME: any -> RootState
// const rootEpic = (
//   action$: ActionsObservable<Action>,
//   state$: StateObservable<any>,
//   dependencies: Object,
// ) => epic$.pipe(
//   mergeMap(epic =>
//     epic(action$, state$, dependencies)
//   )
// )

// epicMiddleware.run(rootEpic)

// // sometime later...add another Epic, keeping the state of the old ones...
// epic$.next(wechatyEpic)
// // and again later add another...
// epic$.next(wechatyEpic)

/**
 * Others
 */
// store.subscribe(() => {
//   console.info('state:', store.getState())
// })
