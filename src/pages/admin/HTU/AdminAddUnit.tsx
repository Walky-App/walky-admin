import { useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'
import { SelectedOption } from '../../../components/shared/general/SelectedOption'
import { useAdmin } from '../../../contexts/AdminContext'
import { type Unit } from '../../../interfaces/unit'
import { RequestService } from '../../../services/RequestService'
import { unitsType } from './AdminDetailsUnit'

export const AdminAddUnit = () => {
  const { setUnit, setModule } = useAdmin()
  const [title, setTitle] = useState<string>('')
  const [time, setTime] = useState<number>(0)
  const [urlVideo, setUrlVideo] = useState<string>('')
  const [urlCaption, setUrlCaption] = useState<string>('')
  const [unitType, setUnitType] = useState<string>('blog')
  const params = useParams()
  const navigate = useNavigate()

  const redirectToPreviousPath = (unitId = '') => {
    const currentPath = window.location.pathname
    const newPath = currentPath.substring(0, currentPath.lastIndexOf('/'))
    if (unitId === '') {
      setModule(undefined)
      navigate(newPath)
    } else {
      navigate(newPath + `/${unitId}`)
    }
  }

  const handleRequest = async () => {
    if (title === '' || time === 0) {
      alert('Please fill the title and time')
      return
    }
    const newUnit = {
      moduleId: params.moduleId,
      title,
      time: time * 60,
      type: unitType,
      url_video: urlVideo,
      url_caption: urlCaption,
    }
    try {
      const url = 'units'
      const method = 'POST'
      const response: Unit = await RequestService(url, method, newUnit)
      if (response._id) {
        setUnit(response)
        redirectToPreviousPath(response._id)
      } else {
        console.error('Error uploading data and image')
      }
    } catch (error) {
      console.error('Request error:', error)
    }
  }

  return (
    <div className="w-full sm:overflow-x-hidden">
      <HeaderComponent title="Create Unit" />
      <form>
        <div className="space-y-12">
          <div className=" pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="title">
                  Title
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-600 ">
                    <input
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                      id="title"
                      name="title"
                      onChange={e => setTitle(e.target.value)}
                      placeholder="Unit title"
                      type="text"
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="reading_time">
                  Reading time
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-600 ">
                    <input
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                      id="reading_time"
                      min={0}
                      name="reading_time"
                      onChange={e => setTime(Number(e.target.value))}
                      placeholder="x minutes"
                      type="number"
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="unit_type">
                  Unit type
                </label>
                <div className="mt-2">
                  <SelectedOption
                    classStyle="w-full sm:max-w-md"
                    selectedOptions={unitsType}
                    setSelectedOptions={setUnitType}
                    value={unitType}
                  />
                </div>
              </div>
              {unitType === 'video' ? (
                <>
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="url_video">
                      Url video
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-600 ">
                        <input
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                          id="url_video"
                          name="url_video"
                          onChange={e => setUrlVideo(e.target.value)}
                          placeholder="Url video"
                          type="text"
                          value={urlVideo}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="url_caption">
                      Url caption
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-600 ">
                        <input
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                          id="url_caption"
                          name="url_caption"
                          onChange={e => setUrlCaption(e.target.value)}
                          placeholder="Url caption"
                          type="text"
                          value={urlCaption}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                className="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-gray-200"
                onClick={() => redirectToPreviousPath()}
                type="button">
                Cancel
              </button>
              <button
                className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                onClick={handleRequest}
                type="button">
                Create
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
