// import {
//   Action,
// }                       from 'redux'
// import {
//   Epic,
// }                       from 'redux-observable'
// import {
//   filter,
//   mapTo,
// }                       from 'rxjs/operators'

// import {
//   wechatyTypes,
//   wechatyActions,
// }                   from '../wechaty'

// import {
//   RootState,
// }                   from '../'

// export const counterEpic: Epic<any, any, RootState> = (action$, state$) => action$.ofType(wechatyActions.messageEvent.match).pipe(
//   filter(action => action.type === 'PING'),
//   mapTo({ type: 'PONG' })
//   tap(_ => console.info('state$.value', state$.value))
// )

