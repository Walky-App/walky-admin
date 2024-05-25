/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'

import { set } from 'react-hook-form'

import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { InputSwitch } from 'primereact/inputswitch'
import { io, type Socket } from 'socket.io-client'

import { type ITransaction } from '../../../pages/admin/dashboard/AdminDashboard'
import { RequestService } from '../../../services/RequestService'

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

  const [socket, setSocket] = useState<Socket | null>(null)

  const [messages, setMessages] = useState<IMessage[] | null>([])
  useEffect(() => {
    const getAllMessages = async () => {
      const allMessages = await RequestService('messages')
      setProducts(allMessages)
    }

    getAllMessages()
  }, [])

  const sendMessage = async () => {
    if (socket) {
      socket.emit('send-message', {
        channel_id: '660ec8eff5dbd8c67a5bac55',
        user_id: '65b2adf55b4bf7bf54d111f6',
        message: 'Hello',
      })
    }
  }

  useEffect(() => {
    // const newSocket = io('ws://localhost:4040' as string)
    // newSocket.on('connect', () => {
    //   newSocket.emit('join-chat', { channel_id: '660ec8eff5dbd8c67a5bac55', user_id: '65b2adf55b4bf7bf54d111f6' })
    // })
    // newSocket.on('660ec8eff5dbd8c67a5bac55', () => {
    //   // console.log('message received')
    // })
    // newSocket.on('disconnect', () => {
    //   // console.log('disconnected')
    // })
    // setSocket(newSocket)
    // return () => {
    //   newSocket.disconnect()
    // }
  }, [])

  return (
    <div className="card">
      <button type="button" onClick={sendMessage}>
        Send Message
      </button>
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
