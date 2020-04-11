import { createAction }   from 'typesafe-actions'

// import { Message } from 'wechaty'

import * as types from './types'

// export const add = createAction('todos/ADD', action => (title: string) => action({ id: cuid(), title, completed: false }))
// add: (title: string) => { type: "todos/ADD"; payload: { id: string, title: string, completed: boolean; }; }
export const moMessage = createAction(types.MESSAGE_MO)() // , action => (title: string) => action({ id: cuid(), title, completed: false }))
export const mtMessage = createAction(types.MESSAGE_MT)()

// export const addTodo = createAction('ADD_TODO', (title: string) => ({
//   id: cuid(),
//   title,
// }))<Todo>();

// export const moMessage = createAction(types.MESSAGE_MO)
// export const mtMessage = createAction(types.MESSAGE_MT)
