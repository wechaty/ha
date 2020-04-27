#!/usr/bin/env ts-node

import { test } from 'tstest'

import {
  aroundSeconds,
}                   from './utils'

test('aroundSeconds()', async t => {
  const SECONDS = 60
  const FACTOR = 1 / 6
  const MS_MAX = 70 * 1000
  const MS_MIN = 50 * 1000

  const result = aroundSeconds(SECONDS, FACTOR)
  t.ok(result < MS_MAX, 'should less than max')
  t.ok(result > MS_MIN, 'should more than min')
  t.notEqual(result, SECONDS * 1000, 'should not equal to original')
})
