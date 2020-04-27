#!/usr/bin/env ts-node

import { test } from 'tstest'

import { State } from './reducers'

import {
  getAvailable,
}                   from './selectors'
import { Wechaty } from 'wechaty'
import { HAWechaty } from '../../ha-wechaty'

test('getAvailable() for empty state', async t => {
  const state: State = {
    availability : {},
    cluster      : {},
    ha           : {},
    wechaty      : {},
  }

  const result = getAvailable(state)
  t.equal(result, false, 'should not available')
})

test('getAvailable() with a state', async t => {
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

  let result = getAvailable(state)
  t.equal(result, true, 'should available')
  result = getAvailable(state, wechaty)
  t.equal(result, true, 'should available query by wechaty')
  result = getAvailable(state, haWechaty)
  t.equal(result, true, 'should available query by haWechaty')

  const state2 = {
    ...state,
    availability: {
      ...state.availability,
      [WECHATY_ID]: false,
    },
  }

  result = getAvailable(state2)
  t.equal(result, true, 'should not available')
  result = getAvailable(state2, wechaty)
  t.equal(result, true, 'should not available query by wechaty')
  result = getAvailable(state2, haWechaty)
  t.equal(result, true, 'should not available query by haWechaty')
})
