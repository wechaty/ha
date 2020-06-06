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

import {
  milliAroundSeconds,
}                       from './utils'

test('aroundSeconds()', async t => {
  const SECONDS = 60
  const FACTOR = 1 / 6

  const MS_MAX = 71 * 1000
  const MS_MIN = 49 * 1000

  const result = milliAroundSeconds(SECONDS, FACTOR)

  t.ok(result < MS_MAX, 'should less than max')
  t.ok(result > MS_MIN, 'should more than min')
  t.notEqual(result, SECONDS * 1000, 'should not equal to original (mostly)')
})
