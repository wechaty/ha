#!/usr/bin/env ts-node

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
import { test } from 'tstest'

import { State } from './reducers'
import * as selectors from './selectors'

test('isHaAvailable() for empty state', async t => {
  const state: State = {
    availability : {},
    cluster      : {},
  }

  const result = selectors.isHaAvailable(state)()
  t.equal(result, false, 'should not available')
})

test('isWechatyAvailable() for empty state', async t => {
  const state: State = {
    availability : {},
    cluster      : {},
  }

  const result = selectors.isWechatyAvailable(state)('wechaty_id')
  t.equal(result, false, 'should not available')
})

test('isWechatyAvailable() with a state', async t => {
  const WECHATY_ID = 'test_id'

  const state = {
    availability: {
      [WECHATY_ID]: true,
    },
  } as any as State

  let result = selectors.isWechatyAvailable(state)(WECHATY_ID)
  t.equal(result, true, 'should available')

  const state2 = {
    ...state,
    availability: {
      ...state.availability,
      [WECHATY_ID]: false,
    },
  }

  result = selectors.isWechatyAvailable(state2)(WECHATY_ID)
  t.equal(result, false, 'should not available')
})

test('isHaAvailable() with a state', async t => {
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

  let result = selectors.isHaAvailable(state)()
  t.equal(result, true, 'should available')
  result = selectors.isWechatyAvailable(state)(WECHATY_ID)
  t.equal(result, true, 'should available query by wechaty')
  result = selectors.isHaAvailable(state)(HAWECHATY_ID)
  t.equal(result, true, 'should available query by haWechaty')

  const state2 = {
    ...state,
    availability: {
      ...state.availability,
      [WECHATY_ID]: false,
    },
  }

  result = selectors.isHaAvailable(state2)()
  t.equal(result, false, 'should not available')
  result = selectors.isWechatyAvailable(state2)(WECHATY_ID)
  t.equal(result, false, 'should not available query by wechaty')
  result = selectors.isHaAvailable(state2)(HAWECHATY_ID)
  t.equal(result, false, 'should not available query by haWechaty')
})

test('getHa()', async t => {
  const WECHATY_ID = 'wechaty_id'
  const HAWECHATY_ID = 'hawechaty_id'

  const state: State = {
    availability: {},
    cluster: {
      [WECHATY_ID]: HAWECHATY_ID,
    },
  }

  let result = selectors.getHaByWechaty(state)(WECHATY_ID)
  t.equal(result, HAWECHATY_ID, 'should get haWechaty from wechaty')
})
