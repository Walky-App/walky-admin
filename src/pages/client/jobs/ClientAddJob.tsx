import * as React from 'react'
import { useState, useRef } from 'react'
import TitleComponent from '../../../components/shared/general/TitleComponent'
import { GetTokenInfo } from '../../../utils/TokenUtils'
import { RequestService } from '../../../services/RequestService'
import { Calendar } from 'primereact/calendar'
import { Nullable } from 'primereact/ts-helpers'
import { Steps } from 'primereact/steps'
import { Toast } from 'primereact/toast'
import { MenuItem } from 'primereact/menuitem'
import { Editor, EditorTextChangeEvent } from 'primereact/editor'
import { Controller, useForm } from 'react-hook-form'
import { Button } from 'primereact/button'
import { classNames } from 'primereact/utils'
import { InputText } from 'primereact/inputtext'

export default function ClientAddJob() {
  interface Facility {
    _id: string
    name: string
    address: string
  }

  const [activeIndex, setActiveIndex] = useState<number>(0)
  const toast = useRef<Toast>(null)
  const [facilities, setFacilities] = React.useState<any>([])
  const [dates, setDates] = useState<Nullable<Date[]>>(null)

  const user = GetTokenInfo()
  const id = user?._id

  React.useEffect(() => {
    const getFacilities = async () => {
      const allFacilities = await RequestService(`facilities/byclient/${id}`)
      setFacilities(allFacilities)
    }

    getFacilities()
  }, [])

  const facility_id = facilities.map((facility: any) => facility._id)

  const items: MenuItem[] = [
    {
      label: 'Basic Information',
      command: event => {
        toast.current?.show({ severity: 'info', summary: 'First Step', detail: event.item.label })
      },
    },
    {
      label: 'Job Details',
      command: event => {
        toast.current?.show({ severity: 'info', summary: 'Second Step', detail: event.item.label })
      },
    },
    {
      label: 'Shift Details',
      command: event => {
        toast.current?.show({ severity: 'info', summary: 'Last Step', detail: event.item.label })
      },
    },
  ]

  function BasicInfo() {
    const [description, setDescription] = useState<string>('')
    const defaultValues = {
      value: '',
      title: '',
    }

    const {
      control,
      formState: { errors },
      handleSubmit,
      getValues,
      reset,
    } = useForm({ defaultValues })

    const getFormErrorMessage = (name: string) => {
      //@ts-ignore
      return errors[name] ? (
        //@ts-ignore
        <small className="p-error">{errors[name].message}</small>
      ) : (
        <small className="p-error">&nbsp;</small>
      )
    }

    return (
      <>
        <p className="mb-6 mt-6 text-sm leading-6 text-gray-600">
          Please take a moment to provide the essential information for the job posting. We require you to specify the
          position title, and provide a comprehensive job description. Click on the next step as soon as you are done.
        </p>
        <Controller
          name="title" // This references the field name in your form
          control={control} // Passed from useForm()
          rules={{ required: 'Job Title is required.' }} // Validation rules for this field
          render={({ field, fieldState }) => (
            <>
              <label htmlFor={field.name} className={classNames({ 'p-error': fieldState.error })}>
                Job Title
              </label>
              <span className="p-float-label">
                <InputText
                  id={field.name} // Each field should have a unique ID
                  value={field.value} // Set the value to the field value
                  className={classNames({ 'p-invalid': fieldState.error })} // Add 'p-invalid' class if there is an error
                  onChange={e => field.onChange(e.target.value)} // Handle changes with field.onChange
                />
              </span>
              {getFormErrorMessage(field.name)}
            </>
          )}
        />
        <div className="col-span-full">
          <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
            Job Description
          </label>
          <div className="mt-2">
            <div className="card">
              <Editor
                value={description}
                onTextChange={(e: EditorTextChangeEvent) => setDescription(e.htmlValue ?? '')}
                style={{ height: '320px' }}
              />
            </div>
          </div>

          <p className="mt-3 text-sm leading-6 text-gray-600">Write notes about the Job.</p>
        </div>
      </>
    )
  }
  function JobDetails() {
    return (
      <>
        <div className="sm:col-span-3">
          <label htmlFor="facility-id" className="block text-sm font-medium leading-6 text-gray-900">
            Choose Facility and Address
          </label>
          <div className="mt-2">
            <select
              name="facility_id"
              id="facility-id"
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
              {facilities.map((facility: Facility) => (
                <option key={facility._id} value={facility._id}>
                  {facility.name} - {facility.address}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="sm:col-span-3">
          <label htmlFor="employment-type" className="block text-sm font-medium leading-6 text-gray-900">
            Employment Type
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="employment_type"
              id="employment-type"
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        {/* Skills Input */}
        <div className="sm:col-span-3">
          <label htmlFor="skills" className="block text-sm font-medium leading-6 text-gray-900">
            Skills*
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="skills"
              id="skills"
              placeholder="Enter skills separated by commas"
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="salary" className="block text-sm font-medium leading-6 text-gray-900">
            Base Pay Rate*
          </label>
          <div className="mt-2">
            <input
              type="number"
              name="base_rate"
              id="base_rate"
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </>
    )
  }
  function ShiftDetails() {
    return (
      <>
        {/* Shift Times Input */}
        <div className="sm:col-span-3">
                <label htmlFor="shift_times" className="block text-sm font-medium leading-6 text-gray-900">
                  Shift Times
                </label>
                <div className="mt-2">
                  <input
                    type="time"
                    name="shift_times"
                    id="shift-times"
                    placeholder="e.g., 8:00,19:00"
                    className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="shift_dates" className="block text-sm font-medium leading-6 text-gray-900">
                  Shift Dates
                </label>
                

                {/* Calendar Input */}
                <div className="card justify-content-center flex">
                  <Calendar value={dates} onChange={e => setDates(e.value)} selectionMode="multiple" readOnlyInput />
                </div>
              </div>
        <div className="mt-6 flex items-center justify-center gap-x-6">
          <button
            type="submit"
            className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Save
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <TitleComponent title={'Add a new job'} />
      <div className="card">
        <Toast ref={toast}></Toast>
        <Steps model={items} activeIndex={activeIndex} onSelect={e => setActiveIndex(e.index)} readOnly={false} />
        <div>
          {activeIndex === 0 && <BasicInfo />} {/* Only renders this when Step 1 is active */}
          {activeIndex === 1 && <JobDetails />} {/* Only renders this when Step 2 is active */}
          {activeIndex === 2 && <ShiftDetails />} {/* Only renders this when Step 3 is active */}
        </div>
      </div>
    </>
  )
}
