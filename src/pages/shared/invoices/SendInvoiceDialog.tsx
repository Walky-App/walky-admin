import { useState } from 'react'

import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Tag } from 'primereact/tag'

import { XMarkIcon } from '@heroicons/react/24/outline'

interface SendInvoiceDialogProps {
  visible: boolean
  setVisible: (visible: boolean) => void
}

export const SendInvoiceDialog = ({ visible, setVisible }: SendInvoiceDialogProps) => {
  const [emails, setEmails] = useState<string[]>([])
  const [inputEmail, setInputEmail] = useState<string>('')

  const removeEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index))
    addEmail()
  }

  const addEmail = () => {
    setEmails([...emails, inputEmail])
    setInputEmail('')
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
        <div className="flex flex-wrap gap-2">
          {emails.map((email, index) => (
            <Tag className="basis-1/4 bg-gray-400 font-black" key={index}>
              <div className="align-items-center flex gap-1">
                <span className="text-base">{email}</span>
                <XMarkIcon className="h-5 w-5 cursor-pointer font-black" onClick={() => removeEmail(index)} />
              </div>
            </Tag>
          ))}
        </div>

        <div>
          <InputText placeholder="Email" className="w-full" value={inputEmail} />
          <Button label="Add" className="mt-2" />
        </div>
        <div className="mt-4 lg:ml-auto">
          <Button disabled={emails.length === 0} size="large" label="Confirm" onClick={() => setVisible(false)} />
        </div>
      </div>
    </Dialog>
  )
}
