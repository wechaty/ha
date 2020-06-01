/**
 * Using createReducer API with type-free syntax
 *  We can prevent a lot of boilerplate code and type errors using this powerful and completely typesafe API.
 *
 * Typesafe utilities designed to reduce types verbosity and complexity in Redux Architecture.
 *  https://github.com/piotrwitek/typesafe-actions#using-createreducer-api-with-type-free-syntax
 */
import { StateType, ActionType } from 'typesafe-actions'

declare module 'typesafe-actions' {
  export type Store = StateType<typeof import('./index').default>

  export type RootState = StateType<typeof import('./root-reducer').default>

  export type RootAction = ActionType<typeof import('./root-action').default>

  interface Types {
    RootAction: RootAction
  }
}
