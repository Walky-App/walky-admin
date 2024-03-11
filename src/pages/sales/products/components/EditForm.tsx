import React, { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { Editor, EditorTextChangeEvent } from 'primereact/editor'
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Toast } from 'primereact/toast'
import { classNames } from 'primereact/utils'

import { IProduct } from '../../../../interfaces/Product'
import { RequestService } from '../../../../services/RequestService'

interface EditFormProps {
  product: IProduct | undefined
}

export const EditForm: React.FC<EditFormProps> = ({ product }) => {
  const toast = useRef<Toast>(null)

  const defaultValues = {
    name: product?.name,
    description: '',
    each_price: product?.each_price || product?.msrp || 0,
    msrp: product?.msrp || 0,
    brand: product?.brand || '',
    stock: product?.stock || 0,
    category: product?.category || '',
    category_sub1: product?.category_sub1 || '',
    category_sub2: product?.category_sub2 || '',
    each_upc: product?.each_upc || '',
    sold_in_quantities_of: product?.sold_in_quantities_of || 1,
    case_qty: product?.case_qty || 1,
    case_price: product?.case_price || 0,
    case_cost: product?.case_cost || 0,
    case_weight: product?.case_weight || '',
    case_length: product?.case_length || '',
    case_width: product?.case_width || '',
    case_height: product?.case_height || '',
    case_upc: product?.case_upc || '',
    case_discount: product?.case_discount || 0,
    pallet_qty: product?.pallet_qty || 1,
    pallet_price: product?.pallet_price || 0,
    pallet_cost: product?.pallet_cost || 0,
    pallet_weight: product?.pallet_weight || '',
    pallet_length: product?.pallet_length || '',
    pallet_width: product?.pallet_width || '',
    pallet_height: product?.pallet_height || '',
    pallet_upc: product?.pallet_upc || '',
    pallet_discount: product?.pallet_discount || 0,
    warranty: product?.warranty || '',
    hazmat: product?.hazmat || false,
    legacy_sku: product?.legacy_sku || '',
    image_thumb: product?.image_thumb || '',
    image_medium: product?.image_medium || '',
    image_family_thumb: product?.image_family_thumb || '',
    image_family_medium: product?.image_family_medium || '',
    discontinued: product?.discontinued || false,
  }

  const values = product || defaultValues

  const {
    control,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm({ values })

  const onSubmit = async (data: any) => {
    try {
      const requestData = { ...data }
      const response = await RequestService(`jobs/${product?._id}`, 'PATCH', requestData)
      if (response) {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Basic information updated successfully',
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

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
    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
      <Toast ref={toast} />

      <div className="space-y-12">
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 border-b border-t border-gray-900/10 pb-12 pt-10 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Product Info</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please take a moment to provide the essential information for the job posting. We require you to specify
              the job title and provide a facility this job pertains to.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                Name
              </label>
              <div className="mt-2">
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    required: 'Job name is required.',
                    maxLength: { value: 100, message: 'Job name cannot exceed 100 characters.' },
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <span className="p-float-label">
                        <InputText
                          id={field.name}
                          value={field.value}
                          className={classNames({ 'p-invalid': fieldState.error })}
                          onChange={e => field.onChange(e.target.value)}
                        />
                      </span>
                      {getFormErrorMessage(field.name)}
                    </>
                  )}
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="facility" className="block text-sm font-medium leading-6 text-gray-900">
                Description
              </label>
              <div className="mt-2">
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: 'description is required.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputTextarea
                        id={field.name}
                        rows={7}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        className={classNames({ 'p-invalid': fieldState.error })}
                      />
                      <div>{getFormErrorMessage(field.name)}</div>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="facility" className="block text-sm font-medium leading-6 text-gray-900">
                Price Each
              </label>
              <div className="mt-2">
                <Controller
                  name="each_price"
                  control={control}
                  rules={{ required: 'price is required.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputNumber
                        mode="currency"
                        currency="USD"
                        locale="en-US"
                        id={field.name}
                        value={field.value}
                        onChange={e => field.onChange(e.value)}
                        className={classNames({ 'p-invalid': fieldState.error })}
                      />
                      <div>{getFormErrorMessage(field.name)}</div>
                    </>
                  )}
                />{' '}
              </div>
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="facility" className="block text-sm font-medium leading-6 text-gray-900">
                Msrp Each
              </label>
              <div className="mt-2">
                <Controller
                  name="msrp"
                  control={control}
                  rules={{ required: 'price is required.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputNumber
                        mode="currency"
                        currency="USD"
                        locale="en-US"
                        id={field.name}
                        value={field.value}
                        onChange={e => field.onChange(e.value)}
                        className={classNames({ 'p-invalid': fieldState.error })}
                      />
                      <div>{getFormErrorMessage(field.name)}</div>
                    </>
                  )}
                />{' '}
              </div>
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="facility" className="block text-sm font-medium leading-6 text-gray-900">
                Brand
              </label>
              <div className="mt-2">
                <Controller
                  name="brand"
                  control={control}
                  rules={{ required: 'brand is required.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        id={field.name}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        className={classNames({ 'p-invalid': fieldState.error })}
                      />
                      <div>{getFormErrorMessage(field.name)}</div>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="facility" className="block text-sm font-medium leading-6 text-gray-900">
                Each UPC
              </label>
              <div className="mt-2">
                <Controller
                  name="each_upc"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        id={field.name}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        className={classNames({ 'p-invalid': fieldState.error })}
                      />
                      <div>{getFormErrorMessage(field.name)}</div>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="facility" className="block text-sm font-medium leading-6 text-gray-900">
                Stock
              </label>
              <div className="mt-2">
                <Controller
                  name="stock"
                  control={control}
                  rules={{ required: 'price is required.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputNumber
                        id={field.name}
                        value={field.value}
                        onChange={e => field.onChange(e.value)}
                        className={classNames({ 'p-invalid': fieldState.error })}
                      />
                      <div>{getFormErrorMessage(field.name)}</div>
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Categories  */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Category Information</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please provide a comprehensive job description for this job.
            </p>
          </div>
          <div className="grid-cols- grid max-w-2xl gap-x-5 gap-y-6 sm:grid-cols-2 md:col-span-2">
            <div className="sm:col-span-1">
              <label htmlFor="facility" className="block text-sm font-medium leading-6 text-gray-900">
                Main Category
              </label>
              <div className="mt-2">
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: 'price is required.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        id={field.name}
                        options={[
                          'Enzymes & Drip Cleaners',
                          'Harvest & Post Harvest',
                          'IPM',
                          'pH Control',
                          'Pots and Containers',
                          'Propagation',
                          'Safety & PPE',
                          'Sanitize & Sterlize',
                          'Salts, Nutriens, & Amendments',
                          'Testing and Measurement',
                        ]}
                        value={field.value?.toString()}
                        onChange={e => field.onChange(e.target.value)}
                        className={classNames({ 'p-invalid': fieldState.error })}
                      />
                      <div>{getFormErrorMessage(field.name)}</div>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="facility" className="block text-sm font-medium leading-6 text-gray-900">
                Sub Category 1
              </label>
              <div className="mt-2">
                <Controller
                  name="category_sub1"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        id={field.name}
                        value={field.value?.toString()}
                        onChange={e => field.onChange(e.target.value)}
                        className={classNames({ 'p-invalid': fieldState.error })}
                      />
                      <div>{getFormErrorMessage(field.name)}</div>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="sm:col-span-1">
              <label className="block font-medium leading-6 text-gray-900" htmlFor="facility">
                Sub Category 2
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="category_sub2"
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        id={field.name}
                        value={field.value?.toString()}
                        options={[
                          'Safety & PPE',
                          'Sanitize & Sterlize',
                          'Salts, Nutriens, & Amendments',
                          'IPM',
                          'Propagation',
                          'Pots and Containers',
                          'Enzymes & Drip Cleaners',
                          'pH Control',
                          'Testing and Measurement',
                          'Harvest & Post Harvest',
                        ]}
                        onChange={e => field.onChange(e.target.value)}
                        className={classNames({ 'p-invalid': fieldState.error })}
                      />
                      <div>{getFormErrorMessage(field.name)}</div>
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <div>
          <Button type="submit" label="Submit" />
        </div>
      </div>
    </form>
  )
}
