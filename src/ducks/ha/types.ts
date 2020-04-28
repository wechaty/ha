const WECHATY_ADD = 'HAWechaty/WECHATY_ADD'
const WECHATY_DEL = 'HAWechaty/WECHATY_DEL'

const WECHATY_FAILURE = 'HAWechaty/WECHATY_FAILURE'
const WECHATY_RECOVER = 'HAWechaty/WECHATY_RECOVER'

const HA_FAILURE = 'HAWechaty/FAILURE'
const HA_RECOVER = 'HAWechaty/RESTORE'

const DING = 'HAWechaty/DING'
const DONG = 'HAWechaty/DONG'

export default {
  WECHATY_ADD,
  WECHATY_DEL,

  WECHATY_FAILURE,
  WECHATY_RECOVER,

  ...{
    HA_FAILURE,
    HA_RECOVER,
  },

  DING,
  DONG,
}
