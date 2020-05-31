import { Wechaty } from 'wechaty'

const instanceStore = new Map<string, Wechaty>()

const getWechaty = (id: string): Wechaty => {
  const wechaty = instanceStore.get(id)
  if (!wechaty) {
    throw new Error('no wechaty found for id ' + id)
  }
  return wechaty
}

const setWechaty = (wechaty: Wechaty): void => {
  const id = wechaty.id
  if (instanceStore.get(id)) {
    throw new Error('wechaty id ' + id + ' has already been set before! it can not be set twice.')
  }
  instanceStore.set(id, wechaty)
}

const removeWechaty = (wechaty: Wechaty): void => {
  const id = wechaty.id
  if (!instanceStore.get(id)) {
    throw new Error('wechaty id ' + id + ' does not exist!')
  }
  instanceStore.delete(id)

}

const getMessage = (wechatyId: string, id: string) => getWechaty(wechatyId).Message.load(id)
const getRoom    = (wechatyId: string, id: string) => getWechaty(wechatyId).Room.load(id)
const getContact = (wechatyId: string, id: string) => getWechaty(wechatyId).Contact.load(id)

export {
  getWechaty,
  setWechaty,
  removeWechaty,

  getMessage,
  getRoom,
  getContact,
}
