#!/usr/bin/env ts-node

import { test } from 'tstest'

import { State } from './reducers'
import * as selectors from './selectors'

test('isHAAvailable() for empty state', async t => {
  const state: State = {
    availability : {},
    cluster      : {},
  }

  const result = selectors.isHAAvailable(state)
  t.equal(result, false, 'should not available')
})

test('isWechatyAvailable() for empty state', async t => {
  const state: State = {
    availability : {},
    cluster      : {},
  }

  const result = selectors.isWechatyAvailable(state, 'wechaty_id')
  t.equal(result, false, 'should not available')
})

test('isWechatyAvailable() with a state', async t => {
  const WECHATY_ID = 'test_id'

  const state = {
    availability: {
      [WECHATY_ID]: true,
    },
  } as any as State

  let result = selectors.isWechatyAvailable(state, WECHATY_ID)
  t.equal(result, true, 'should available')

  const state2 = {
    ...state,
    availability: {
      ...state.availability,
      [WECHATY_ID]: false,
    },
  }

  result = selectors.isWechatyAvailable(state2, WECHATY_ID)
  t.equal(result, true, 'should not available')
})

test('isHAAvailable() with a state', async t => {
  const WECHATY_ID = 'test_id'
  const HAWECHATY_ID = 'test_ha_id'

  const state: State = {
    availability: {
      [WECHATY_ID]: true,
    },
    cluster: {
      [WECHATY_ID]: HAWECHATY_ID,
    },
  }

  let result = selectors.isHAAvailable(state)
  t.equal(result, true, 'should available')
  result = selectors.isHAAvailable(state, WECHATY_ID)
  t.equal(result, true, 'should available query by wechaty')
  result = selectors.isHAAvailable(state, HAWECHATY_ID)
  t.equal(result, true, 'should available query by haWechaty')

  const state2 = {
    ...state,
    availability: {
      ...state.availability,
      [WECHATY_ID]: false,
    },
  }

  result = selectors.isHAAvailable(state2)
  t.equal(result, true, 'should not available')
  result = selectors.isHAAvailable(state2, WECHATY_ID)
  t.equal(result, true, 'should not available query by wechaty')
  result = selectors.isHAAvailable(state2, HAWECHATY_ID)
  t.equal(result, true, 'should not available query by haWechaty')
})

test('getHA()', async t => {
  const WECHATY_ID = 'wechaty_id'
  const HAWECHATY_ID = 'hawechaty_id'

  const state: State = {
    availability: {},
    cluster: {
      [WECHATY_ID]: HAWECHATY_ID,
    },
  }

  let result = selectors.getHAOfWechatyId(state, WECHATY_ID)
  t.equal(result, HAWECHATY_ID, 'should get haWechaty from wechaty')
})
