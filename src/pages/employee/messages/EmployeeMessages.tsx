import { useCallback, useState } from 'react'
import { useEffect } from 'react'

import { format } from 'date-fns'
import { Button } from 'primereact/button'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { HeadingComponent } from '../../../components/shared/general/HeadingComponent'
import { type IMessageDocument, type IChatInfo } from '../../../interfaces/messages'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { cn } from '../../../utils/cn'
import { GetTokenInfo } from '../../../utils/tokenUtil'

export const EmployeeMessages = () => {
  const [chatInfo, setChatInfo] = useState<IChatInfo>()
  const [input, setInput] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const loggedInUserId = GetTokenInfo()._id

  const { showToast } = useUtils()

  const AdminId = '65b2adf55b4bf7bf54d111f6'

  const getMessagesByUsers = useCallback(async () => {
    setLoading(true)
    try {
      const response = await requestService({
        path: `messages/byusers`,
        method: 'POST',
        body: JSON.stringify({ participants: [AdminId, loggedInUserId] }),
      })

      if (response.ok) {
        const data = await response.json()
        setChatInfo(data)
        setLoading(false)
      }
    } catch (error) {
      console.error('error fetching messages', error)
    }
  }, [AdminId, loggedInUserId])

  useEffect(() => {
    getMessagesByUsers()
  }, [AdminId, getMessagesByUsers, loggedInUserId])

  const handleNewChat = async () => {
    try {
      const response = await requestService({
        path: 'messages/new-channel',
        method: 'POST',
        body: JSON.stringify({
          name: `New chat with Admin`,
          description: `Converstation with ${AdminId}`,
          recipients: [AdminId, loggedInUserId],
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
          recipients: [{ user_id: AdminId }],
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
      <HeadingComponent title="Chat with Admins" />
      {chatInfo !== undefined && chatInfo !== null ? (
        <>
          <ul className="overflow-y-scroll p-4">
            <Button label="Refresh" onClick={getMessagesByUsers} />
            {loading ? (
              <HTLoadingLogo />
            ) : (
              chatInfo.messages.map((message: IMessageDocument) => (
                <li
                  key={message._id}
                  className={cn(message.sender_id.toString() === loggedInUserId ? 'text-right' : 'text-left', 'mt-3')}>
                  <p className="font-bold">
                    <small>{format(message.createdAt, 'Pp')}</small>
                  </p>
                  <p>{message.message_content}</p>
                </li>
              ))
            )}
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
