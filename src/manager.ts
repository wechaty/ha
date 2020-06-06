import { HAWechaty } from './ha-wechaty'

const instances = new Map<string, HAWechaty>()

const getHa = (id: string) => {
  const ha = instances.get(id)
  if (!ha) {
    throw new Error('no HA Wechaty instance for id ' + id)
  }
  return ha
}

const addHa = (haWechaty: HAWechaty) => {
  if (instances.has(haWechaty.id)) {
    throw new Error('HAWechaty with id: ' + haWechaty.id + ' has been already set before, and can not be added twice.')
  }
  instances.set(haWechaty.id, haWechaty)
}

export {
  getHa,
  addHa,
}
