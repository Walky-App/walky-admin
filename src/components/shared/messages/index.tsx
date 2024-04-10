import { useState, useEffect } from 'react'

import { Controller, type SubmitHandler, useForm, type FieldErrors } from 'react-hook-form'

import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { InputTextarea } from 'primereact/inputtextarea'
import { MultiSelect } from 'primereact/multiselect'
import { ProgressBar } from 'primereact/progressbar'
import { TabPanel, TabView } from 'primereact/tabview'
import { Tag } from 'primereact/tag'
import { classNames } from 'primereact/utils'

import { RequestService } from '../../../services/RequestService'
import { useUtils } from '../../../store/useUtils'
import { roleChecker } from '../../../utils/roleChecker'

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

interface IMessageDocument {
  _id: string
  sender_id: IUserSlim
  message_content: string
  recipients: IRecipient[]
  updatedAt: string
  createdAt: string
}

interface IAllMessages {
  inboxMessages: IMessageDocument[]
  sentMessages: IMessageDocument[]
}

interface IMessageFormValues {
  name: string
  recipients: IUserSlim[]
  message_content: string
}

export const Messages = () => {
  const [selectedUsers, setSelectedUsers] = useState<IUserSlim[]>([])
  const [selectedMessage, setSelectedMessage] = useState<IMessageDocument>()
  const [allMessages, setAllMessages] = useState<IAllMessages>()
  const [allUsers, setAllUsers] = useState<IUserSlim[]>([])
  const [newMessageVisible, setNewMessageVisible] = useState(false)
  const [messageDetailIsVisible, setMessageDetailIsVisible] = useState(false)

  const { showToast } = useUtils()

  const defaultValues: IMessageFormValues = {
    name: 'message',
    recipients: [],
    message_content: '',
  }

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues })

  const roleType = roleChecker()

  useEffect(() => {
    const getMessages = async () => {
      try {
        if (roleType === 'admin') {
          const allUsers = await RequestService(`users`)
          if (allUsers.length !== 0) {
            setAllUsers(allUsers)
          }
        }

        const data = await RequestService(`messages`)

        if (data.length !== 0) {
          setAllMessages(data)
        }
      } catch (error) {
        console.error('error fetching messages', error)
      }
    }
    getMessages()
  }, [roleType])

  const handleMessageRecepients = () => {
    if (roleType === 'admin') {
      return selectedUsers.map((user: IUserSlim) => user._id)
    } else {
      return ['65cba8c7754a306367231ab7', '65b2adf55b4bf7bf54d111f6', '65ca5fb0f4845af92cca29d4'] // Employee should only be able to send messages to Admins
    }
  }

  const handleMessageMarkAsRead = async (id: string) => {
    try {
      const response = await RequestService(`messages/${id}/read`)
      if (response !== null && response !== undefined) {
        setAllMessages(response)
      }
    } catch (error) {
      console.error('Error:', error)
      showToast({ severity: 'error', summary: 'Error', detail: 'Error creating holiday' })
    }
  }

  const handleInboxMessageClick = (message: IMessageDocument) => {
    setMessageDetailIsVisible(true)
    handleMessageMarkAsRead(message._id)
  }

  const onSubmit: SubmitHandler<IMessageFormValues> = async data => {
    try {
      const response = await RequestService('messages', 'POST', { ...data, recipients: handleMessageRecepients() })
      if (response !== null && response !== undefined) {
        setAllMessages(response)
        showToast({ severity: 'success', summary: 'Success', detail: 'message sent successfully!' })
        reset()
      }
    } catch (error) {
      console.error('Error:', error)
      showToast({ severity: 'error', summary: 'Error', detail: 'Error creating holiday' })
    }
  }

  function getFormErrorMessage(path: string, errors: FieldErrors) {
    const pathParts = path.split('.')
    let error: FieldErrors = errors

    for (const part of pathParts) {
      if (typeof error !== 'object' || error === null) {
        return null
      }
      error = error[part as keyof typeof error] as FieldErrors
    }

    if (error?.message) {
      return error.message ? <p className="mt-2 text-sm text-red-600">{String(error.message)}</p> : null
    }
    return null
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 pb-12 md:grid-cols-1">
        <div className="flex justify-between">
          <h1 className="text-xl font-bold leading-7 text-gray-900">Messages</h1>
          <Button onClick={() => setNewMessageVisible(true)}>+ New</Button>
        </div>

        <TabView className="mt-4">
          <TabPanel header="Inbox">
            {!allMessages?.inboxMessages ? (
              <ProgressBar mode="indeterminate" style={{ height: '6px' }} />
            ) : (
              <DataTable
                value={allMessages?.inboxMessages}
                selectionMode="single"
                selection={selectedMessage}
                onSelectionChange={e => setSelectedMessage(e.value as IMessageDocument)}
                onRowSelect={e => handleInboxMessageClick(e.data)}
                dataKey="_id"
                paginator
                rows={20}
                className="bg-gray-100"
                metaKeySelection={false}
                rowClassName={(rowData: IMessageDocument) =>
                  rowData.recipients.map((recipient: IRecipient) => (recipient.read === false ? ' font-bold' : ''))
                }
                tableStyle={{ minWidth: '50rem' }}>
                <Column field="sender_id.first_name" header="From" />
                <Column field="message_content" header="Message" style={{ width: '70%' }} />
                <Column
                  style={{ width: '12rem' }}
                  body={(rowData: IMessageDocument) => <span>{new Date(rowData.createdAt).toLocaleString()}</span>}
                  header="Date & Time"
                />
              </DataTable>
            )}
          </TabPanel>
          <TabPanel header="Sent">
            <DataTable
              value={allMessages?.sentMessages}
              selectionMode="single"
              selection={selectedMessage}
              onSelectionChange={e => setSelectedMessage(e.value as IMessageDocument)}
              dataKey="_id"
              paginator
              rows={20}
              metaKeySelection={false}
              tableStyle={{ minWidth: '50rem' }}>
              <Column
                field="sender_id.first_name"
                header="To"
                body={(rowData: IMessageDocument) =>
                  rowData.recipients.map((recipient: IRecipient) => (
                    <span key={rowData._id}> {recipient.user_id.email}</span>
                  ))
                }
              />
              <Column field="message_content" header="Message" />
              <Column
                body={(rowData: IMessageDocument) => <span>{new Date(rowData.createdAt).toLocaleString()}</span>}
                header="Date"
              />
              <Column
                header="Read"
                body={rowData =>
                  rowData.recipients.map((recipient: IRecipient) =>
                    recipient.read === true ? <Tag key={recipient._id} className="mr-2" value="Read" /> : null,
                  )
                }
              />
            </DataTable>
          </TabPanel>
        </TabView>
      </div>

      <Dialog
        header="New Message"
        visible={newMessageVisible}
        style={{ width: '50vw' }}
        onHide={() => setNewMessageVisible(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-gray-900/10 pb-12 md:grid-cols-2">
            <div className="md:col-span- grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
              {roleType === 'admin' ? (
                <div className="sm:col-span-3">
                  <label htmlFor="recipients" className="block text-sm font-medium leading-6 text-gray-900">
                    To
                  </label>
                  <div className="mt-2">
                    <Controller
                      name="recipients"
                      control={control}
                      render={() => (
                        <div className="card justify-content-center flex">
                          <MultiSelect
                            value={selectedUsers}
                            onChange={e => setSelectedUsers(e.value)}
                            options={allUsers}
                            optionLabel="email"
                            placeholder="Select Users"
                            maxSelectedLabels={3}
                            className="md:w-20rem w-full"
                          />
                        </div>
                      )}
                    />
                  </div>
                  {getFormErrorMessage('recipients', errors)}
                </div>
              ) : null}
              <div className="sm:col-span-6">
                <label htmlFor="message_content" className="block text-sm font-medium leading-6 text-gray-900">
                  New Message
                </label>
                <div className="mt-2">
                  <Controller
                    name="message_content"
                    control={control}
                    rules={{ required: 'Message is required' }}
                    render={({ field, fieldState }) => (
                      <InputTextarea
                        id={field.name}
                        value={field.value}
                        name="message_content"
                        className={classNames({ 'p-invalid': fieldState.error }, 'w-full')}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => field.onChange(e.target.value)}
                      />
                    )}
                  />
                </div>
              </div>
              <div className=" sm:col-span-6">
                <Button onClick={() => setNewMessageVisible(false)} type="submit" label="Send" />
              </div>
            </div>
          </div>
        </form>
      </Dialog>
      <Dialog
        header="Message Details"
        visible={messageDetailIsVisible}
        style={{ width: '50vw' }}
        onHide={() => setMessageDetailIsVisible(false)}>
        <h2>
          <strong> From: </strong> {selectedMessage?.sender_id?.email ?? ''}
        </h2>
        <h3 className="mb-5">
          <strong> Date & Time: </strong>
          {selectedMessage?.createdAt ? new Date(selectedMessage?.createdAt).toLocaleString() : ''}
        </h3>
        <hr className="mb-5" />
        <p>{selectedMessage?.message_content}</p>
      </Dialog>
    </>
  )
}
