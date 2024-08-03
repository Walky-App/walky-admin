import React, { useCallback, useState } from 'react'
import { useEffect } from 'react'

import { format } from 'date-fns'
import { Button } from 'primereact/button'

import { type IUser } from '../../../interfaces/User'
import { type IMessageDocument, type IChatInfo } from '../../../interfaces/messages'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { cn } from '../../../utils/cn'
import { GetTokenInfo } from '../../../utils/tokenUtil'

export const Chat = ({ formUser }: { formUser: IUser | undefined }) => {
  const [chatInfo, setChatInfo] = useState<IChatInfo>()
  const [input, setInput] = useState<string>('')
  const loggedInUser_id = GetTokenInfo()._id

  const { showToast } = useUtils()

  const AdminId = '65b2adf55b4bf7bf54d111f6'

  const getMessagesByUsers = useCallback(async () => {
    try {
      const response = await requestService({
        path: `messages/byusers`,
        method: 'POST',
        body: JSON.stringify({ participants: [formUser?._id, loggedInUser_id] }),
      })

      if (response.ok) {
        const data = await response.json()
        setChatInfo(data)
      }
    } catch (error) {
      console.error('error fetching messages', error)
    }
  }, [formUser?._id, loggedInUser_id])

  useEffect(() => {
    getMessagesByUsers()
  }, [formUser?._id, getMessagesByUsers, loggedInUser_id])

  const handleNewChat = async () => {
    try {
      const response = await requestService({
        path: 'messages/new-channel',
        method: 'POST',
        body: JSON.stringify({
          name: `New chat with ${formUser?.first_name} ${formUser?.last_name}`,
          description: `Admin converstation with ${formUser?._id}`,
          recipients: [formUser?._id, loggedInUser_id],
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
          recipients: [{ user_id: formUser?._id === loggedInUser_id ? AdminId : formUser?._id }],
          sender_id: loggedInUser_id,
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
          <ul className="overflow-y-scroll p-4">
            <Button label="Refresh" onClick={getMessagesByUsers} />
            {chatInfo.messages.map((message: IMessageDocument) => (
              <li
                key={message._id}
                className={cn(message.sender_id.toString() === loggedInUser_id ? 'text-right' : 'text-left', 'mt-3')}>
                <p className="font-bold">
                  <small>{format(message.createdAt, 'Pp')}</small>
                </p>
                <p>{message.message_content}</p>
              </li>
            ))}
          </ul>
          <div className="flex border-t p-4">
            <input
              type="text"
              className="mr-2 flex-1 rounded border p-2"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && sendMessage()}
            />
            <Button label="Send" onClick={sendMessage} />
          </div>
        </>
      ) : (
        <Button label="New Chat" onClick={handleNewChat} />
      )}
    </div>
  )
}
