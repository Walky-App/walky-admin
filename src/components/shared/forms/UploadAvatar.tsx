import { useRef, useState, useEffect } from 'react'
import { UserCircleIcon } from '@heroicons/react/24/solid'

export default function UploadAvatar() {
  const [file, setFile] = useState()
  const [previewUrl, setPreviewUrl] = useState<any>()

  const filePickerRef = useRef<any>()

  useEffect(() => {
    if (!file) return

    const fileReader = new FileReader()
    const started = fileReader.onprogress

    fileReader.onload = () => {
      console.log('fileReader ->', fileReader)
      setPreviewUrl(fileReader.result)
    }
    fileReader.readAsDataURL(file)
  }, [file])

  const pickedHandler = (event: any) => {
    if (event.target.files && event.target.files.length === 1) {
      const pickedFile = event.target.files[0]
      setFile(pickedFile)
      // setIsValid(true)
    } else {
      // setIsValid(false)
    }
    // props.onInput(props.id)
  }

  const pickImageHandler = () => {
    filePickerRef.current.click()
  }

  return (
    <div className="col-span-full">
      <label htmlFor="photo" className="block ml-2 text-sm font-medium leading-6 text-gray-900">
        Avatar
      </label>
      <div className="mt-2 flex items-center gap-x-3">
        <input
          // id={id}
          ref={filePickerRef}
          style={{ display: 'none' }}
          type="file"
          accept=".jpg,.png,.jpeg"
          onChange={pickedHandler}
        />
        {previewUrl ? (
          <img
            src={previewUrl}
            className="inline-block h-14 w-14 rounded-full object-cover object-center"
            alt="Preview"
          />
        ) : (
          <UserCircleIcon className="h-14 w-14 text-gray-300" aria-hidden="true" />
        )}

        <button
          type="button"
          onClick={pickImageHandler}
          className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          Change
        </button>
      </div>
    </div>
  )
}
