const SWITCH_ON  = 'wechaty/SWITCH_ON'
const SWITCH_OFF = 'wechaty/SWITCH_OFF'

const EVENT_DONG        = 'wechaty/EVENT_DONG'
const EVENT_ERROR       = 'wechaty/EVENT_ERROR'
const EVENT_FRIENDSHIP  = 'wechaty/EVENT_FRIENDSHIP'
const EVENT_HEARTBEAT   = 'wechaty/EVENT_HEARTBEAT'
const EVENT_LOGIN       = 'wechaty/EVENT_LOGIN'
const EVENT_LOGOUT      = 'wechaty/EVENT_LOGOUT'
const EVENT_MESSAGE     = 'wechaty/EVENT_MESSAGE'
const EVENT_READY       = 'wechaty/EVENT_READY'
const EVENT_RESET       = 'wechaty/EVENT_RESET'
const EVENT_ROOM_INVITE = 'wechaty/EVENT_ROOM_INVITE'
const EVENT_ROOM_JOIN   = 'wechaty/EVENT_ROOM_JOIN'
const EVENT_ROOM_LEAVE  = 'wechaty/EVENT_ROOM_LEAVE'
const EVENT_ROOM_TOPIC  = 'wechaty/EVENT_ROOM_TOPIC'
const EVENT_SCAN        = 'wechaty/EVENT_SCAN'

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
    EVENT_ERROR,
    EVENT_FRIENDSHIP,
    EVENT_HEARTBEAT,
    EVENT_LOGIN,
    EVENT_LOGOUT,
    EVENT_MESSAGE,
    EVENT_READY,
    EVENT_RESET,
    EVENT_ROOM_INVITE,
    EVENT_ROOM_JOIN,
    EVENT_ROOM_LEAVE,
    EVENT_ROOM_TOPIC,
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
