import React, { useCallback, useState } from 'react'
import { useEffect } from 'react'

import { format, isToday } from 'date-fns'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'

import { type IUser } from '../../../interfaces/User'
import { type IMessageDocument, type IChatInfo } from '../../../interfaces/messages'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { cn } from '../../../utils/cn'
import { roleChecker } from '../../../utils/roleChecker'
import { GetTokenInfo } from '../../../utils/tokenUtil'

export const Chat = ({ formUser }: { formUser: IUser | undefined }) => {
  const [chatInfo, setChatInfo] = useState<IChatInfo>()
  const [input, setInput] = useState<string>('')
  const loggedInUserId = GetTokenInfo()._id

  const role = roleChecker()

  const { showToast } = useUtils()

  const AdminId = '65b2adf55b4bf7bf54d111f6'

  const getMessagesByUsers = useCallback(async () => {
    try {
      const response = await requestService({
        path: `messages/byusers`,
        method: 'POST',
        body: JSON.stringify({ participants: [formUser?._id, AdminId] }),
      })

      if (response.ok) {
        const data = await response.json()
        setChatInfo(data)
      }
    } catch (error) {
      console.error('error fetching messages', error)
    }
  }, [formUser?._id])

  useEffect(() => {
    getMessagesByUsers()
  }, [formUser?._id, getMessagesByUsers])

  const handleNewChat = async () => {
    try {
      const response = await requestService({
        path: 'messages/new-channel',
        method: 'POST',
        body: JSON.stringify({
          name: `New chat with ${formUser?.first_name} ${formUser?.last_name}`,
          description: `Admin converstation with ${formUser?._id}`,
          recipients: [formUser?._id, AdminId],
        }),
      })
      if (response.ok) {
        const data = await response.json()
        setChatInfo(data)
        showToast({ severity: 'success', summary: 'Success', detail: 'Chat created Successfully!' })
      }
    } catch (error) {
      console.error('error fetching messages', error)
    }
  }

  const sendMessage = async () => {
    try {
      const response = await requestService({
        path: `messages/${chatInfo?._id}`,
        method: 'POST',
        body: JSON.stringify({
          recipients: [{ user_id: role === 'admin' ? formUser?._id : AdminId }],
          sender_id: loggedInUserId,
          message_content: input,
        }),
      })
      if (response.ok) {
        const data = await response.json()
        setChatInfo(data)
        showToast({ severity: 'success', summary: 'Success', detail: 'message sent successfully!' })
        setInput('')
      }
    } catch (error) {
      console.error('Error:', error)
      showToast({ severity: 'error', summary: 'Error', detail: 'Error sending message' })
    }
  }

  return (
    <div className="h-4/6 w-1/2">
      {chatInfo !== undefined && chatInfo !== null ? (
        <>
          <div className="border-b p-4">
            <h2 className="mb-3 text-xl text-gray-500">
              {role === 'admin' ? `Chat with ${formUser?.first_name} ${formUser?.last_name}` : 'Chat with Admins'}
            </h2>
            <input
              type="text"
              className="mr-2 w-3/4 flex-1 rounded border p-2"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && sendMessage()}
            />
            <Button label="Send" onClick={sendMessage} />
            <Button icon="pi pi-refresh" onClick={getMessagesByUsers} className="ml-2" />
          </div>
          <ul className="overflow-y-scroll p-4">
            {chatInfo.messages
              .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
              .map((message: IMessageDocument) => (
                <li
                  key={message._id}
                  className={cn(message.sender_id.toString() === loggedInUserId ? 'text-right' : 'text-left', 'mt-3')}>
                  <p className="text-gray-400">
                    <small>
                      {isToday(message.createdAt)
                        ? 'Today' + format(message.createdAt, ' p')
                        : format(message.createdAt, 'Pp')}
                    </small>
                  </p>
                  <p>{message.message_content}</p>
                </li>
              ))}
            <Divider className="mt-12" />
            <h3 className="text-center text-xl text-gray-500"> Oldest Messages </h3>
          </ul>
        </>
      ) : role === 'admin' ? (
        <Button label="New Chat" onClick={handleNewChat} />
      ) : (
        <p>No messages, yet </p>
      )}
    </div>
  )
}
