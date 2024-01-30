import { useRef, useState, useEffect } from 'react'
import { FaCirclePlus } from 'react-icons/fa6'

export default function UploadArea({ label, name, path, required, id }: any) {
  const [file, setFile] = useState()
  const [previewUrl, setPreviewUrl] = useState<any>()
  const [isValid, setIsValid] = useState(false)

  const filePickerRef = useRef<any>()

  const [fileUrl, setFileUrl] = useState('')

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
      setIsValid(true)
    } else {
      setIsValid(false)
    }
    // props.onInput(props.id)
  }

  const pickImageHandler = () => {
    filePickerRef.current.click()
  }

  const handleFileUpload = (e: any): void => {
    const formData = new FormData()
    // formData.append('file', file)
  }

  // const handleFileUpload = (e: any): void => {
  // const target = e.target as any
  // const file = target.files[0]
  // console.log(file.name)
  // const fileRef = ref(storageRef, file.name)
  // setFilePath(fileRef._location.path_) // This can be stored in database and used to generate a download link
  // uploadBytes(fileRef, file).then((snapshot) => {
  //   console.log('Uploaded a blob or file!')
  //   getDownloadURL(snapshot.ref).then((downloadURL) => {
  //     console.log('File available at', downloadURL)
  //     setFileUrl(downloadURL) // This is the TEMPORARY download link
  //   })
  // })
  // }

  return (
    <div className="flex-1">
      {/* <input type="hidden" name={name + 'Path'} value={filePath} /> */}
      {/* <input type="hidden" name={name + 'Url'} value={fileUrl} /> */}
      {/* <label htmlFor={name} className="block text-sm font-bold leading-6 text-zinc-900">
        {label}
      </label>
      <button className="btn" type="button" onClick={pickImageHandler}>
        pick image
      </button> */}

      {/* <label
        htmlFor={name}
        className="relative cursor-pointer rounded-md font-semibold text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-600 focus-within:ring-offset-2 hover:text-green-500">
        <div className="mt-2 flex justify-center rounded-lg bg-zinc-100 px-6 py-10">
          <div className="text-center">
            <FaCirclePlus className="mx-auto h-12 w-12 text-zinc-900" aria-hidden="true"  />
            <div className="mt-4 flex-col text-sm leading-6 text-zinc-600">
              <span>Upload a file</span>
              <input
                id={name}
                required={required}
                // onChange={handleFileUpload}
                onChange={pickHandler}
                name={name}
                type="file"
                accept="image/*,application/pdf"
                // accept='.jpg,.png,.jpeg,.pdf'
                className="sr-only"
              />

              {previewUrl && <img src={previewUrl} className='rounded w-200 h-200' alt="" />}
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-zinc-600">PDF, PNG, JPG, JPEG, PNG up to 10MB</p>
          </div>
        </div>
      </label> */}

      <div className="form-control">
        <input
          id={id}
          ref={filePickerRef}
          style={{ display: 'none' }}
          type="file"
          accept=".jpg,.png,.jpeg"
          onChange={pickedHandler}
        />
        <div className={`image-upload`}>
          <div className="image-upload__preview">
            {previewUrl && <img src={previewUrl} className="w-200 h-200" alt="Preview" />}
            {!previewUrl && <p>Please pick an image.</p>}
          </div>
          <button type="button" onClick={pickImageHandler}>
            PICK IMAGE
          </button>
        </div>
        {/* {!isValid && <p>{props.errorText}</p>} */}
      </div>
    </div>
  )
}
