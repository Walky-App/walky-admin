import { useState } from 'react'

import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Tag } from 'primereact/tag'

import { XMarkIcon } from '@heroicons/react/24/outline'

import { type ILog } from '../../../interfaces/logs'
import { type IServiceInvoice } from '../../../interfaces/serviceInvoice'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'

interface SendInvoiceDialogProps {
  invoiceId: string | undefined
  setInvoice: (invoice: IServiceInvoice | null) => void
  setLogs: (logs: ILog[]) => void
  setIsLoading(status: boolean): void
  setVisible: (visible: boolean) => void
  visible: boolean
}

export const SendInvoiceDialog = ({
  invoiceId,
  setInvoice,
  setLogs,
  setIsLoading,
  setVisible,
  visible,
}: SendInvoiceDialogProps) => {
  const { showToast } = useUtils()
  const [emails, setEmails] = useState<string[]>([])
  const [inputEmail, setInputEmail] = useState<string>('')
  const [emailError, setEmailError] = useState<string>('')

  const removeEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index))
  }

  const addEmail = () => {
    if (!validateEmail(inputEmail)) {
      setEmailError('Invalid email address')
    } else if (emails.includes(inputEmail)) {
      setEmailError('Email already exists')
    } else {
      setEmails([...emails, inputEmail])
      setInputEmail('')
      setEmailError('')
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addEmail()
    }
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(String(email).toLowerCase())
  }

  const clearStates = () => {
    setEmails([])
    setInputEmail('')
    setEmailError('')
    setVisible(false)
  }

  const handlerSendEmails = async () => {
    try {
      setIsLoading(true)
      const response = await requestService({
        path: `invoices/send-email/${invoiceId}`,
        method: 'POST',
        body: JSON.stringify({
          emails,
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to send email')
      }
      const { invoice, logs } = await response.json()
      setInvoice(invoice)
      setLogs(logs)
      clearStates()
      showToast({
        severity: 'success',
        summary: 'Completed',
        detail: 'Email sent successfully',
      })
      setIsLoading(false)
    } catch (error) {
      console.error('Error sending email:', error)
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      visible={visible}
      dismissableMask
      header="Add the emails to send the invoice"
      blockScroll
      onHide={() => setVisible(false)}
      className="md:w-4/5 lg:w-10/12">
      <div className="flex w-full flex-col items-center rounded-lg bg-white px-4 py-5 xl:px-8">
        <div className="flex flex-wrap justify-center gap-2">
          {emails.map((email, index) => (
            <Tag className="basis-1/4 bg-gray-300 " key={index}>
              <div className="align-items-center flex items-center justify-center gap-1">
                <span className="text-base text-black">{email}</span>
                <XMarkIcon className="h-5 w-5 cursor-pointer text-red-500" onClick={() => removeEmail(index)} />
              </div>
            </Tag>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-center gap-2">
          <div>
            <InputText
              placeholder="Email"
              type="email"
              className="w-full"
              value={inputEmail}
              onChange={e => setInputEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="text-sm text-red-500">{emailError}</div>
          </div>
          <Button label="Add" onClick={addEmail} />
        </div>
        <div className="mt-4 lg:ml-auto">
          <Button disabled={emails.length === 0} size="large" label="Confirm" onClick={handlerSendEmails} />
        </div>
      </div>
    </Dialog>
  )
}
