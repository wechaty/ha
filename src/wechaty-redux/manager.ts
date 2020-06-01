import { Wechaty } from 'wechaty'

const instanceStore = new Map<string, Wechaty>()

const getWechaty = (wechatyId: string): Wechaty => {
  const wechaty = instanceStore.get(wechatyId)
  if (!wechaty) {
    throw new Error('no wechaty found for id ' + wechatyId)
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

const getMessage = (wechatyId: string, messageId: string) => getWechaty(wechatyId).Message.load(messageId)
const getRoom    = (wechatyId: string, roomId: string)    => getWechaty(wechatyId).Room.load(roomId)
const getContact = (wechatyId: string, contactId: string) => getWechaty(wechatyId).Contact.load(contactId)

export {
  getWechaty,
  setWechaty,
  removeWechaty,

  getMessage,
  getRoom,
  getContact,
}
