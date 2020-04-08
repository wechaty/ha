#!/usr/bin/env ts-node

import test  from 'tstest'

import {
  HAWechaty,
}               from './ha-wechaty'

test('tbw', async (t) => {
  const ha = new HAWechaty()
  t.ok(ha, 'should be instanciated')
})
