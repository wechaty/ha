/**
 *  Huan(202003): Redux with Ducks
 *
 *  Scaling your Redux App with ducks:
 *    https://www.freecodecamp.org/news/scaling-your-redux-app-with-ducks-6115955638be/
 *
 *  Redux Toolkit - Usage With TypeScript:
 *    https://redux-toolkit.js.org/usage/usage-with-typescript
 *
 */

import {
  createStore,
  // compose,
  applyMiddleware,
}                           from 'redux'
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
  never,
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

// create store
export const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(
    epicMiddleware,
  ),
)

epicMiddleware.run(rootEpic)

// export store singleton instance
// export default store

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
store.subscribe(() => {
  console.info('state:', store.getState())
})
