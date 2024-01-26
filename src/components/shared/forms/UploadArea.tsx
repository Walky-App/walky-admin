import { useState } from 'react'
import { FaCirclePlus } from 'react-icons/fa6'
// import { storage } from '@/auth'

export default function UploadArea({ label, name, path, required }: any) {
  // const storageRef = ref(storage, path)

  const [filePath, setFilePath] = useState('')
  const [fileUrl, setFileUrl] = useState('')

  const handleFileUpload = (e: any): void => {
    const target = e.target as any
    const file = target.files[0]
    console.log(file.name)
    // const fileRef = ref(storageRef, file.name)
    // setFilePath(fileRef._location.path_) // This can be stored in database and used to generate a download link
    // uploadBytes(fileRef, file).then((snapshot) => {
    //   console.log('Uploaded a blob or file!')
    //   getDownloadURL(snapshot.ref).then((downloadURL) => {
    //     console.log('File available at', downloadURL)
    //     setFileUrl(downloadURL) // This is the TEMPORARY download link
    //   })
    // })
  }

  return (
    <div className="flex-1">
      <input type="hidden" name={name + 'Path'} value={filePath} />
      <input type="hidden" name={name + 'Url'} value={fileUrl} />
      <label htmlFor={name} className="block text-sm font-bold leading-6 text-zinc-900">
        {label}
      </label>
      <label
        htmlFor={name}
        className="relative cursor-pointer rounded-md font-semibold text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-600 focus-within:ring-offset-2 hover:text-green-500">
        <div className="mt-2 flex justify-center rounded-lg bg-zinc-100 px-6 py-10">
          <div className="text-center">
            <FaCirclePlus className="mx-auto h-12 w-12 text-zinc-900" aria-hidden="true" />
            <div className="mt-4 flex-col text-sm leading-6 text-zinc-600">
              <span>Upload a file</span>
              <input
                id={name}
                required={required}
                onChange={handleFileUpload}
                name={name}
                type="file"
                accept="image/*,application/pdf"
                className="sr-only"
              />
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-zinc-600">PDF, PNG, JPG, JPEG, PNG up to 10MB</p>
          </div>
        </div>
      </label>
    </div>
  )
}
