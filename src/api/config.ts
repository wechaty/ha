export interface PayloadWechatyId { wechatyId: string }
export interface PayloadMessageId { wechatyId: string, messageId: string }
export interface PayloadContactId { wechatyId: string, contactId: string }

export type PayloadAllId = PayloadWechatyId | PayloadMessageId | PayloadContactId
