const SWITCH_ON  = 'wechaty/SWITCH_ON'
const SWITCH_OFF = 'wechaty/SWITCH_OFF'

const EVENT_SCAN      = 'wechaty/EVENT_SCAN'
const EVENT_LOGIN     = 'wechaty/EVENT_LOGIN'
const EVENT_LOGOUT    = 'wechaty/EVENT_LOGOUT'
const EVENT_MESSAGE   = 'wechaty/EVENT_MESSAGE'
const EVENT_DONG      = 'wechaty/EVENT_DONG'
const EVENT_HEARTBEAT = 'wechaty/EVENT_HEARTBEAT'

const DING  = 'wechaty/DING'
const RESET = 'wechaty/RESET'

/**
 * Async
 */
const SAY_REQUEST = 'wechaty/SAY_REQUEST'
const SAY_SUCCESS = 'wechaty/SAY_SUCCESS'
const SAY_FAILURE = 'wechaty/SAY_FAILURE'

export default {
  SWITCH_OFF,
  SWITCH_ON,
  ...{
    EVENT_DONG,
    EVENT_HEARTBEAT,
    EVENT_LOGIN,
    EVENT_LOGOUT,
    EVENT_MESSAGE,
    EVENT_SCAN,
  },
  ...{
    DING,
    RESET,
  },
  ...{
    SAY_FAILURE,
    SAY_REQUEST,
    SAY_SUCCESS,
  },
}
