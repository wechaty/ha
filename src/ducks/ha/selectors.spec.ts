#!/usr/bin/env ts-node

import { test } from 'tstest'

import { Wechaty } from 'wechaty'

import { HAWechaty } from '../../ha-wechaty'

import { State } from './reducers'
import * as selectors from './selectors'

test('getHAAvailable() for empty state', async t => {
  const state: State = {
    availability : {},
    cluster      : {},
    ha           : {},
    wechaty      : {},
  }

  const result = selectors.getHAAvailable(state)
  t.equal(result, false, 'should not available')
})

test('getWechatyAvailable() for empty state', async t => {
  const state: State = {
    availability : {},
    cluster      : {},
    ha           : {},
    wechaty      : {},
  }

  const result = selectors.getWechatyAvailable(state, { id: 'xxxfds' } as Wechaty)
  t.equal(result, false, 'should not available')
})

test('getWechatyAvailable() with a state', async t => {
  const WECHATY_ID = 'fdasfasdfsd'

  const wechaty   = { id: WECHATY_ID } as Wechaty

  const state = {
    availability: {
      [WECHATY_ID]: true,
    },
  } as any as State

  let result = selectors.getWechatyAvailable(state, wechaty)
  t.equal(result, true, 'should available')

  const state2 = {
    ...state,
    availability: {
      ...state.availability,
      [WECHATY_ID]: false,
    },
  }

  result = selectors.getWechatyAvailable(state2, wechaty)
  t.equal(result, true, 'should not available')
})

test('getHAAvailable() with a state', async t => {
  const WECHATY_ID = 'fdasfasdfsd'
  const HAWECHATY_ID = 'j4132431fgvdsvbg'

  const wechaty   = { id: WECHATY_ID }    as Wechaty
  const haWechaty = { id: HAWECHATY_ID }  as HAWechaty

  const state: State = {
    availability: {
      [WECHATY_ID]: true,
    },
    cluster: {
      [WECHATY_ID]: HAWECHATY_ID,
    },
    ha: {
      [HAWECHATY_ID]: haWechaty,
    },
    wechaty: {
      [WECHATY_ID]: wechaty,
    },
  }

  let result = selectors.getHAAvailable(state)
  t.equal(result, true, 'should available')
  result = selectors.getHAAvailable(state, wechaty)
  t.equal(result, true, 'should available query by wechaty')
  result = selectors.getHAAvailable(state, haWechaty)
  t.equal(result, true, 'should available query by haWechaty')

  const state2 = {
    ...state,
    availability: {
      ...state.availability,
      [WECHATY_ID]: false,
    },
  }

  result = selectors.getHAAvailable(state2)
  t.equal(result, true, 'should not available')
  result = selectors.getHAAvailable(state2, wechaty)
  t.equal(result, true, 'should not available query by wechaty')
  result = selectors.getHAAvailable(state2, haWechaty)
  t.equal(result, true, 'should not available query by haWechaty')
})

test('getHA()', async t => {
  const WECHATY_ID = 'fdasfasdfsd'
  const HAWECHATY_ID = 'j4132431fgvdsvbg'

  const wechaty   = { id: WECHATY_ID }    as Wechaty
  const haWechaty = { id: HAWECHATY_ID }  as HAWechaty

  const state: State = {
    availability: {},
    cluster: {
      [WECHATY_ID]: HAWECHATY_ID,
    },
    ha: {
      [HAWECHATY_ID]: haWechaty,
    },
    wechaty: {
      [WECHATY_ID]: wechaty,
    },
  }

  let result = selectors.getHA(state, wechaty)
  t.equal(result, haWechaty, 'should get haWechaty from wechaty')
})
