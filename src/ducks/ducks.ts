interface DuckActions {
}
interface DuckTypes {
}
interface DuckSelectors {
}
interface DuckOperations {
}

// Huan(202004) FIXME:
type DuckMiddleware = (store: any) => (next: any) => (action:any) => void
type DuckReducer = any

/**
 * Huan(202004):
 *  Epic & Saga & Thunk should in ducks, or not?
 */
type DuckEpic    = any
type DuckSaga    = any

interface Duck {
  reducer    : DuckReducer,
  epic?      : DuckEpic,
  saga?      : DuckSaga,
  middleware?: DuckMiddleware,

  actions    : DuckActions,
  operations : DuckOperations,
  selectors  : DuckSelectors,
  types      : DuckTypes,
}
