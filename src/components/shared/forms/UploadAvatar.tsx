import { useRef, useState, useEffect } from 'react'

import { Spinner } from 'flowbite-react'

import { UserCircleIcon, PencilIcon } from '@heroicons/react/24/solid'

import { RequestService } from '../../../services/RequestService'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UploadAvatar = ({ formUser, setFormUser }: any) => {
  const [file, setFile] = useState<File | null>(null)
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

      setFormUser({ ...formUser, avatar: avatar_url })
      setPreviewUrl(avatar_url)
      setUploading(false)
    }

    handleAvatarUpload()
  }, [file, formUser, setFormUser])

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
            className="relative inline-block rounded-full hover:cursor-pointer hover:bg-gray-500 hover:ring-2 hover:ring-green-500"
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
            <span className="absolute right-0  top-0 block  rounded-xl bg-zinc-200 text-center ring-4 ring-white">
              <PencilIcon className="h-6 w-6 py-1 text-zinc-500 " aria-hidden="true" />
            </span>
          </button>
        ) : (
          <Spinner color="success" size="lg" aria-label="Success spinner example" />
        )}
      </div>
    </div>
  )
}
