import { useState, type ChangeEvent } from 'react'

import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputTextarea } from 'primereact/inputtextarea'

interface DiscountDialogProps {
  isOpen: boolean
  hidden: (value: boolean) => void
  handlerSetDiscount: (comment: string) => void
}

export const DiscountDialog = ({ isOpen = false, hidden, handlerSetDiscount }: DiscountDialogProps) => {
  const [comment, setComment] = useState<string>('')

  return (
    <Dialog
      header="Discount description"
      visible={isOpen}
      style={{ width: '50vw' }}
      modal={true}
      onHide={() => hidden(false)}>
      <div className="flex flex-col gap-2">
        <InputTextarea
          rows={5}
          cols={30}
          placeholder="Reason for discount"
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
        />
        <Button type="button" label="Submit" onClick={() => handlerSetDiscount(comment)} disabled={comment === ''} />
      </div>
    </Dialog>
  )
}
