import { useRef, useState, useEffect, type Dispatch, type SetStateAction } from 'react'

import { ProgressSpinner } from 'primereact/progressspinner'

import { UserCircleIcon, PencilIcon } from '@heroicons/react/24/solid'

import { useAuth } from '../../../contexts/AuthContext'
import { type IUser } from '../../../interfaces/User'
import { RequestService } from '../../../services/RequestService'
import { useUtils } from '../../../store/useUtils'

export const UploadAvatar = ({
  formUser,
  setFormUser,
}: {
  formUser: IUser
  setFormUser: Dispatch<SetStateAction<IUser>>
}) => {
  const [file, setFile] = useState<File | null>(null)
  const { setUser, user } = useAuth()
  const { setAvatarImageUrl } = useUtils()
  const [previewUrl, setPreviewUrl] = useState<string>(formUser.avatar || '')
  const [uploading, setUploading] = useState(false)

  const filePickerRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!file) return
    const handleAvatarUpload = async () => {
      setUploading(true)
      const formData = new FormData()
      formData.append('avatar', file)

      const avatar_url = await RequestService(`users/upload-avatar/${formUser._id}`, 'POST', formData, 'binary')

      const temporal = `${avatar_url}?${new Date().getTime()}`
      setAvatarImageUrl(temporal)
      setFormUser({ ...formUser, avatar: temporal })
      if (user) {
        setUser({ ...user, avatar: temporal })
      }
      setPreviewUrl(temporal)
      setUploading(false)
    }

    if (file) {
      handleAvatarUpload()
      setFile(null)
    }
  }, [file, formUser, setFormUser, setAvatarImageUrl, setUser, user])

  const pickedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length === 1) {
      const pickedFile = event.target.files[0]
      setFile(pickedFile)
    }
  }

  const pickImageHandler = () => {
    // @ts-expect-error filePickerRef.current may be null
    filePickerRef.current.click()
  }

  const uniqueImageUrl = `${previewUrl}?${new Date().getTime()}` // to force the browser to reload the image

  return (
    <div className="col-span-full">
      <div className="mt-2 flex items-center gap-x-3">
        <input
          ref={filePickerRef}
          style={{ display: 'none' }}
          type="file"
          accept=".jpg,.png,.jpeg"
          onChange={pickedHandler}
        />

        {!uploading ? (
          <button
            type="button"
            className="relative inline-block hover:cursor-pointer hover:bg-gray-500 hover:ring-2"
            onClick={pickImageHandler}>
            {previewUrl ? (
              <img src={uniqueImageUrl} className="h-50 inline-block w-52" alt="Preview" />
            ) : (
              <UserCircleIcon className="h-20 w-20 text-gray-300" aria-hidden="true" />
            )}
            <span className="absolute right-0  top-0 block  rounded-xl bg-zinc-200 text-center ring-4 ring-white">
              <PencilIcon className="h-6 w-6 py-1 text-zinc-500 " aria-hidden="true" />
            </span>
          </button>
        ) : (
          <ProgressSpinner aria-label="Loading" style={{ color: 'green' }} />
        )}
      </div>
    </div>
  )
}
