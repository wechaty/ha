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
import test  from 'tstest'

import { envWechaty } from './env-wechaty'

test('envWechaty() smoke testing', async t => {
  const ENV = {
    HA_WECHATY_PUPPET: 'wechaty-puppet-service',
    HA_WECHATY_PUPPET_SERVICE_TOKEN: 'token',
  }

  const options = envWechaty(ENV)[0]

  t.equal(options.memory?.name, 'ha-wechaty', 'should set default name for memory')
  delete options.memory

  const EXPECTED_PUPPET_OPTIONS = {
    name: 'ha-wechaty<wechaty-puppet-service>#0',
    puppet: 'wechaty-puppet-service',
    puppetOptions: { token: 'token' },
  }

  t.deepEqual(options, EXPECTED_PUPPET_OPTIONS, 'should parse the env to expected options')
})

test('envWechaty() for 2 puppets and 1 token set', async t => {
  const ENV = {
    HA_WECHATY_PUPPET: 'wechaty-puppet-service:wechaty-puppet-padlocal',
    HA_WECHATY_PUPPET_SERVICE_TOKEN: 'token',
  }

  const options = envWechaty(ENV)[0]

  t.equal(options.memory?.name, 'ha-wechaty', 'should set default name for memory')
  delete options.memory

  const EXPECTED_PUPPET_OPTIONS = {
    name: 'ha-wechaty<wechaty-puppet-service>#0',
    puppet: 'wechaty-puppet-service',
    puppetOptions: { token: 'token' },
  }

  t.deepEqual(options, EXPECTED_PUPPET_OPTIONS, 'should parse the env to expected options')
})

test('envWechaty() for 2 puppets and 1 token for each', async t => {
  const ENV = {
    HA_WECHATY_PUPPET: 'wechaty-puppet-service:wechaty-puppet-padlocal',
    HA_WECHATY_PUPPET_PADLOCAL_TOKEN: 'padlocal_token',
    HA_WECHATY_PUPPET_SERVICE_TOKEN: 'service_token',
  }

  const NAME = 'test-name'

  const optionsList = envWechaty(ENV, NAME)

  t.equal(optionsList[0].memory?.name, NAME, 'should set name for memory')
  t.equal(optionsList[1].memory?.name, NAME, 'should set name for memory')

  delete optionsList[0].memory
  delete optionsList[1].memory

  const EXPECTED_PUPPET_OPTIONS_LIST = [
    {
      name: 'test-name<wechaty-puppet-service>#0',
      puppet: 'wechaty-puppet-service',
      puppetOptions: { token: 'service_token' },
    },
    {
      name: 'test-name<wechaty-puppet-padlocal>#0',
      puppet: 'wechaty-puppet-padlocal',
      puppetOptions: { token: 'padlocal_token' },
    },
  ]

  t.deepEqual(optionsList, EXPECTED_PUPPET_OPTIONS_LIST, 'should parse the env to expected options list')
})

test('envWechaty() for 2 puppets and 2 token for each', async t => {
  const ENV = {
    HA_WECHATY_PUPPET: 'wechaty-puppet-service:wechaty-puppet-padlocal',

    HA_WECHATY_PUPPET_PADLOCAL_TOKEN: 'padlocal_token0:padlocal_token1',
    HA_WECHATY_PUPPET_SERVICE_TOKEN: 'service_token0:service_token1',
  }

  const NAME = 'test-name'

  const optionsList = envWechaty(ENV, NAME)
  optionsList.forEach(opt => delete opt.memory)

  const EXPECTED_PUPPET_OPTIONS_LIST = [
    {
      name: 'test-name<wechaty-puppet-service>#0',
      puppet: 'wechaty-puppet-service',
      puppetOptions: { token: 'service_token0' },
    },
    {
      name: 'test-name<wechaty-puppet-service>#1',
      puppet: 'wechaty-puppet-service',
      puppetOptions: { token: 'service_token1' },
    },
    {
      name: 'test-name<wechaty-puppet-padlocal>#0',
      puppet: 'wechaty-puppet-padlocal',
      puppetOptions: { token: 'padlocal_token0' },
    },
    {
      name: 'test-name<wechaty-puppet-padlocal>#1',
      puppet: 'wechaty-puppet-padlocal',
      puppetOptions: { token: 'padlocal_token1' },
    },

  ]

  t.deepEqual(optionsList, EXPECTED_PUPPET_OPTIONS_LIST, 'should parse the env to expected options list')
})
