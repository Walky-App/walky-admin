interface IUserSlim {
  _id: string
  email: string
  first_name: string
  last_name: string
}

interface IRecipient {
  _id: string
  user_id: IUserSlim
  read: boolean
}

export interface IMessageDocument {
  _id: string
  sender_id: IUserSlim
  message_content: string
  recipients: IRecipient[]
  updatedAt: string
  createdAt: Date
}

export interface IAllMessages {
  inboxMessages: IMessageDocument[]
  sentMessages: IMessageDocument[]
}

export interface IMessageFormValues {
  name: string
  recipients: IUserSlim[]
  message_content: string
}

export interface IChatInfo {
  _id: string
  name: string
  description: string
  participants: IUserSlim[]
  messages: IMessageDocument[]
  createdAt: string
  updatedAt: string
}
