/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'

import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { InputSwitch } from 'primereact/inputswitch'

import { type ITransaction } from '../../../pages/admin/dashboard/AdminDashboard'
import { RequestService } from '../../../services/RequestService'
import { classNames } from '../../../utils/Tailwind'

const statusStyles = {
  success: 'bg-green-100 text-green-800',
  processing: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-gray-100 text-gray-800',
}

interface Props {
  transactions: ITransaction[]
}

interface IMessage {
  _id: string
  sender_id: string
  content: string
  receiver_id: string
  read_by: string[]
  createdAt: string
}

export const MessagesTable: React.FC<Props> = ({ transactions }) => {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [metaKey, setMetaKey] = useState(true)

  const [messages, setMessages] = useState<IMessage[] | null>([])
  useEffect(() => {
    const getAllMessages = async () => {
      const allMessages = await RequestService('/messages')
      setProducts(allMessages)
    }

    getAllMessages()
  }, [])

  return (
    <div className="card">
      <DataTable
        value={products}
        selectionMode="single"
        selection={selectedProduct}
        // onSelectionChange={e => setSelectedProduct(e.value)}
        dataKey="id"
        metaKeySelection={metaKey}
        tableStyle={{ minWidth: '50rem' }}>
        <Column field="content" header="Code" style={{ width: '400px' }} />
        <Column field="createdAt" header="Name" />
      </DataTable>
    </div>
  )
}
