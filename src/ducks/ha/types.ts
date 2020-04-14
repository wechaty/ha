const WECHATY_ADD = 'HAWechaty/ha/WECHATY_ADD'
const WECHATY_DEL = 'HAWechaty/ha/WECHATY_DEL'

const WECHATY_FAIL    = 'HAWechaty/ha/WECHATY_FAIL'
const WECHATY_RECOVER = 'HAWechaty/ha/WECHATY_RECOVER'

const HA_FAIL    = 'HAWechaty/ha/FAIL'
const HA_RECOVER = 'HAWechaty/ha/RESTORE'

const HA_DONG = 'HAWechaty/ha/DONG'

/**
 * Async
 */
const HA_DING_REQUEST = 'HAWechaty/ha/DING_REQUEST'
const HA_DING_SUCCESS = 'HAWechaty/ha/DING_SUCCESS'
const HA_DING_FAILURE = 'HAWechaty/ha/DING_FAILURE'

export default {
  WECHATY_ADD,
  WECHATY_DEL,

  WECHATY_FAIL,
  WECHATY_RECOVER,

  ...{
    HA_FAIL,
    HA_RECOVER,
  },

  HA_DONG,

  ...{
    HA_DING_FAILURE,
    HA_DING_REQUEST,
    HA_DING_SUCCESS,
  },
}
