const SWITCH_ON  = 'wechaty/SWITCH_ON'
const SWITCH_OFF = 'wechaty/SWITCH_OFF'

const EVENT_SCAN    = 'wechaty/EVENT_SCAN'
const EVENT_LOGIN   = 'wechaty/EVENT_LOGIN'
const EVENT_LOGOUT  = 'wechaty/EVENT_LOGOUT'
const EVENT_MESSAGE = 'wechaty/EVENT_MESSAGE'
const EVENT_DONG    = 'wechaty/EVENT_DONG'

/**
 * Async
 */
const RESET_REQUEST  = 'wechaty/RESET_REQUEST'
const RESET_SUCCESS  = 'wechaty/RESET_SUCCESS'
const RESET_FAILURE  = 'wechaty/RESET_FAILURE'

const SAY_REQUEST = 'wechaty/SAY_REQUEST'
const SAY_SUCCESS = 'wechaty/SAY_SUCCESS'
const SAY_FAILURE = 'wechaty/SAY_FAILURE'

const DING_REQUEST = 'wechaty/DING_REQUEST'
const DING_SUCCESS = 'wechaty/DING_SUCCESS'
const DING_FAILURE = 'wechaty/DING_FAILURE'

export default {
  SWITCH_OFF,
  SWITCH_ON,
  ...{
    EVENT_DONG,
    EVENT_LOGIN,
    EVENT_LOGOUT,
    EVENT_MESSAGE,
    EVENT_SCAN,
  },
  ...{
    RESET_FAILURE,
    RESET_REQUEST,
    RESET_SUCCESS,
  },

  ...{
    SAY_FAILURE,
    SAY_REQUEST,
    SAY_SUCCESS,
  },
  ...{
    DING_FAILURE,
    DING_REQUEST,
    DING_SUCCESS,
  },
}
