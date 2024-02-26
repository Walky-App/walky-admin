import { useRef, useState, useMemo } from 'react'
import { UserCircleIcon, PencilIcon } from '@heroicons/react/24/solid'
import { Spinner } from 'flowbite-react'
import { useAuth } from '../../../contexts/AuthContext'
import { RequestService } from '../../../services/RequestService'

export default function UploadAvatar({ formUser, setFormUser }: any) {
  const [file, setFile] = useState<any>()
  const [previewUrl, setPreviewUrl] = useState<any>(formUser.avatar)
  const [uploading, setUploading] = useState(false)
  const { user } = useAuth()

  const filePickerRef = useRef<any>()

  const handleAvatarUpload = async () => {
    setUploading(true)
    const formData = new FormData()
    formData.append('avatar', file)

    const avatar_url = await RequestService(
      `users/upload-avatar/${formUser._id}`,
      'POST',
      formData,
      'binary',
    )

    setFormUser({ ...formUser, avatar: avatar_url })
    setPreviewUrl(avatar_url)
    setUploading(false)
  }

  useMemo(() => {
    if (!file) return
    handleAvatarUpload()
  }, [file])

  const pickedHandler = (event: any) => {
    if (event.target.files && event.target.files.length === 1) {
      const pickedFile = event.target.files[0]
      setFile(pickedFile)
    }
  }

  const pickImageHandler = () => {
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
          <span
            className="relative inline-block hover:bg-gray-500 rounded-full hover:ring-2 hover:ring-green-500 hover:cursor-pointer"
            onClick={pickImageHandler}>
            {previewUrl ? (
              <img
                src={uniqueImageUrl}
                className="inline-block h-20 w-20 rounded-full object-cover object-center"
                alt="Preview"
              />
            ) : (
              <UserCircleIcon className="h-20 w-20 text-gray-300" aria-hidden="true" />
            )}
            <span className="absolute right-0  top-0 block  rounded-xl bg-zinc-200 ring-4 ring-white text-center">
              <PencilIcon className="h-6 w-6 text-zinc-500 py-1 " aria-hidden="true" />
            </span>
          </span>
        ) : (
          <Spinner color="success" size="lg" aria-label="Success spinner example" />
        )}
      </div>
    </div>
  )
}