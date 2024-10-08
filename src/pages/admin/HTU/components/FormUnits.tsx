import { Controller } from 'react-hook-form'
import type { Control, FieldErrors, SubmitHandler, UseFormHandleSubmit } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { classNames } from 'primereact/utils'

import { useAdmin } from '../../../../contexts/AdminContext'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'
import { getFormErrorMessage } from '../../../../utils/ControlError'
import { cn } from '../../../../utils/cn'

export const unitsTypePrimeReact = [
  { title: 'Blog', value: 'blog' },
  { title: 'Video', value: 'video' },
]

export interface IUnitFormValues {
  title?: string
  time?: number
  description?: string
  unitType?: string
  urlVideo?: string
  urlCaptions?: string
  urlImage?: string
}

interface UnitFormProps {
  control: Control<IUnitFormValues>
  errors: FieldErrors<IUnitFormValues>
  handleSubmit: UseFormHandleSubmit<IUnitFormValues>
  unitTypeChosen: string
  setUnitTypeChosen: (value: string) => void
  action?: string
}

export const FormUnits = ({
  control,
  errors,
  handleSubmit,
  unitTypeChosen,
  setUnitTypeChosen,
  action = 'update',
}: UnitFormProps) => {
  const { setUnit, setModule } = useAdmin()
  const params = useParams()
  const navigate = useNavigate()
  const { showToast } = useUtils()

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

  const handleRequest: SubmitHandler<IUnitFormValues> = async data => {
    try {
      const updateUnit = {
        title: data.title,
        time: (data.time as number) * 60,
        description: data.description,
        type: data.unitType,
        url_video: data.urlVideo,
        url_captions: data.urlCaptions,
        url_image: data.urlImage,
      }

      let path = `units/${params.unitId}`
      let method = 'PATCH'
      const newUnit = {
        moduleId: params.moduleId || '',
        title: data.title,
        time: (data.time as number) * 60,
        description: data.description,
        type: data.unitType,
        url_video: data.urlVideo,
        url_captions: data.urlCaptions,
        url_image: data.urlImage,
      }
      if (action === 'create') {
        path = 'units'
        method = 'POST'
      }

      const response = await requestService({
        path,
        method: method as 'POST' | 'PATCH',
        body: JSON.stringify(action === 'create' ? newUnit : updateUnit),
      })
      if (response.ok) {
        const unit = await response.json()
        setUnit(unit)
        showToast({
          severity: 'success',
          summary: 'Success',
          detail: action === 'create' ? 'Unit created successfully' : 'Unit updated successfully',
        })
        action === 'create' && redirectToPreviousPath(unit._id)
      }
    } catch (error) {
      showToast({ severity: 'error', summary: 'Error', detail: 'Error updating Unit' })
      console.error('Error updating Unit:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleRequest)}>
      <div className="space-y-12">
        <div className="gap-y-10border-gray-900/10 grid grid-cols-1 gap-x-8 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Unit Information</h2>
          </div>
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-6 sm:col-start-1">
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                Title
              </label>
              <div className="mt-2">
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: 'Title is required' }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      value={field.value}
                      name="title"
                      className={cn({ 'p-invalid': fieldState.error }, 'w-full')}
                      onChange={e => field.onChange(e.target.value)}
                    />
                  )}
                />
              </div>
              {getFormErrorMessage('title', errors)}
            </div>
            <div className="sm:col-span-6 sm:col-start-1">
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                Unit time
              </label>
              <div className="mt-2">
                <Controller
                  name="time"
                  control={control}
                  rules={{ required: 'Unit time is required' }}
                  render={({ field, fieldState }) => (
                    <InputNumber
                      id={field.name}
                      value={Number(field.value)}
                      name="time"
                      suffix=" minutes"
                      className={cn({ 'p-invalid': fieldState.error }, 'w-full')}
                      onValueChange={e => field.onChange(e.target.value)}
                    />
                  )}
                />
              </div>
              {getFormErrorMessage('time', errors)}
            </div>
            <div className="sm:col-span-6 sm:col-start-1">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                Description
              </label>
              <div className="mt-2">
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: 'Description is required' }}
                  render={({ field, fieldState }) => (
                    <InputTextarea
                      id={field.name}
                      value={field.value}
                      name="description"
                      className={cn({ 'p-invalid': fieldState.error }, 'w-full')}
                      onChange={e => field.onChange(e.target.value)}
                    />
                  )}
                />
              </div>
              {getFormErrorMessage('description', errors)}
            </div>
            <div className="sm:col-span-6 sm:col-start-1">
              <label htmlFor="urlImage" className="block text-sm font-medium leading-6 text-gray-900">
                Url image
              </label>
              <div className="mt-2">
                <Controller
                  name="urlImage"
                  control={control}
                  rules={{ required: 'Url image is required' }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      value={field.value}
                      name="urlImage"
                      className={cn({ 'p-invalid': fieldState.error }, 'w-full')}
                      onChange={e => field.onChange(e.target.value)}
                    />
                  )}
                />
              </div>
              {getFormErrorMessage('urlImage', errors)}
            </div>
            <div className="sm:col-span-6 sm:col-start-1">
              <label htmlFor="unitType" className="block text-sm font-medium leading-6 text-gray-900">
                Unit type
              </label>
              <div className="mt-2">
                <Controller
                  name="unitType"
                  control={control}
                  rules={{ required: 'Gender is required.' }}
                  render={({ field, fieldState }) => (
                    <div>
                      <Dropdown
                        id={field.name}
                        value={field.value}
                        optionLabel="title"
                        options={unitsTypePrimeReact}
                        focusInputRef={field.ref}
                        onChange={e => {
                          field.onChange(e.value)
                          setUnitTypeChosen(e.value)
                        }}
                        className={classNames({ 'p-invalid': fieldState.error }, 'w-full')}
                      />
                    </div>
                  )}
                />
              </div>
              {getFormErrorMessage('unitType', errors)}
            </div>
            {unitTypeChosen === 'video' ? (
              <>
                <div className="sm:col-span-6 sm:col-start-1">
                  <label htmlFor="urlVideo" className="block text-sm font-medium leading-6 text-gray-900">
                    Url video
                  </label>
                  <div className="mt-2">
                    <Controller
                      name="urlVideo"
                      control={control}
                      rules={{ required: unitTypeChosen === 'video' ? 'Url video is required' : false }}
                      render={({ field, fieldState }) => (
                        <InputText
                          id={field.name}
                          value={field.value}
                          name="urlVideo"
                          className={cn({ 'p-invalid': fieldState.error }, 'w-full')}
                          onChange={e => field.onChange(e.target.value)}
                        />
                      )}
                    />
                  </div>
                  {getFormErrorMessage('urlVideo', errors)}
                </div>
                <div className="sm:col-span-6 sm:col-start-1">
                  <label htmlFor="urlCaptions" className="block text-sm font-medium leading-6 text-gray-900">
                    Url captions
                  </label>
                  <div className="mt-2">
                    <Controller
                      name="urlCaptions"
                      control={control}
                      rules={{ required: unitTypeChosen === 'video' ? 'Url captions is required' : false }}
                      render={({ field, fieldState }) => (
                        <InputText
                          id={field.name}
                          value={field.value}
                          name="urlCaptions"
                          className={cn({ 'p-invalid': fieldState.error }, 'w-full')}
                          onChange={e => field.onChange(e.target.value)}
                        />
                      )}
                    />
                  </div>
                  {getFormErrorMessage('urlCaptions', errors)}
                </div>
              </>
            ) : null}
          </div>
          <div className="col-span-6 col-start-1 mt-3 flex justify-end gap-3">
            <Button
              className="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-gray-200"
              onClick={() => redirectToPreviousPath('')}
              type="button"
              label="Cancel"
            />
            <Button type="submit" label="Submit" />
          </div>
        </div>
      </div>
    </form>
  )
}
