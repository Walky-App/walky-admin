import { useRef } from 'react'

import { Dialog } from 'primereact/dialog'
import { FileUpload, type FileUploadBeforeSendEvent, type FileUploadErrorEvent } from 'primereact/fileupload'
import { Toast } from 'primereact/toast'

import { GetTokenInfo } from '../../../../utils/tokenUtil'

interface WelcomeDialogProps {
  visible: boolean
  setVisible: (visible: boolean) => void
}

export const ImportUpdateModal = ({ visible, setVisible }: WelcomeDialogProps) => {
  const toast = useRef<Toast>(null)

  const handleOnUpload = async () => {
    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'File Uploaded' })
    setVisible(false)
  }

  function setHeaders(event: FileUploadBeforeSendEvent) {
    const { access_token } = GetTokenInfo()
    event.xhr.setRequestHeader('Authorization', `Bearer ${access_token}`)
  }

  return (
    <div className="flex justify-center">
      <Dialog
        draggable={false}
        header="Import or Update Products"
        onHide={() => setVisible(false)}
        style={{ width: '50vw' }}
        visible={visible}>
        <p className="m-0 mb-5">
          Use this template file to import or update products - &nbsp;
          <a className="text-green-600 hover:text-green-400" href="/assets/import-template.csv">
            import-template.csv
          </a>
        </p>

        <Toast ref={toast} />
        <FileUpload
          accept=".csv"
          maxFileSize={1000000}
          mode="basic"
          name="product-update-csv"
          onBeforeSend={setHeaders}
          onError={(e: FileUploadErrorEvent) => {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: e.xhr.response })
          }}
          onUpload={handleOnUpload}
          url={`${process.env.REACT_APP_PUBLIC_API}/products/updater`}
        />
      </Dialog>
    </div>
  )
}
