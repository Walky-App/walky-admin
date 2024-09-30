/* eslint-disable react/no-danger */
import { useEffect, useState, useCallback } from 'react'

import { Controller, useForm, type FieldErrors } from 'react-hook-form'

import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Editor, type EditorTextChangeEvent } from 'primereact/editor'
import { InputText } from 'primereact/inputtext'
import { MultiSelect, type MultiSelectChangeEvent } from 'primereact/multiselect'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { type IAnnouncement } from '../../../interfaces/announcement'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { cn } from '../../../utils/cn'
import { states } from '../../../utils/formOptions'
import { roleChecker } from '../../../utils/roleChecker'

interface FormData {
  title: string
  states: string[]
  roles: string[]
}

export const AdminAnnouncementsPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([])
  const [content, setContent] = useState<string>('')
  const role = roleChecker()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()
  const { showToast } = useUtils() // Destructure showToast from useUtils

  const roles = [
    { title: 'Employee', value: 'employee' },
    { title: 'Client', value: 'client' },
  ]

  const renderHeader = () => {
    return (
      <>
        <select className="ql-header" />
        <select className="ql-font" />
        <span className="ql-formats">
          <button aria-label="Bold" className="ql-bold" type="button" />
          <button aria-label="Italic" className="ql-italic" type="button" />
          <button aria-label="Underline" className="ql-underline" type="button" />
        </span>
        <span className="ql-formats">
          <select className="ql-color" />
          <button className="ql-list" type="button" value="ordered" />
          <button className="ql-list" type="button" value="bullet" />
          <select className="ql-align" />
        </span>
        <span className="ql-formats">
          <button className="ql-link" type="button" />
        </span>
      </>
    )
  }

  const header = renderHeader()

  const handleTextChange = (e: EditorTextChangeEvent) => {
    setContent(e.htmlValue as string)
  }

  const fetchAnnouncements = useCallback(async () => {
    setIsLoading(true)
    try {
      let response
      if (role === 'admin') {
        // Fetch announcements
        response = await requestService({ path: 'announcements' })
        if (!response.ok) throw new Error('Failed to fetch announcements')
        const announcements: IAnnouncement[] = await response.json()
        setAnnouncements(announcements)
      } else {
        setAnnouncements([])
      }
    } catch (error) {
      console.error('Error fetching data', error)
    } finally {
      setIsLoading(false)
    }
  }, [role])

  useEffect(() => {
    fetchAnnouncements()
  }, [fetchAnnouncements])

  const getFormErrorMessage = (name: keyof FormData, errors: FieldErrors<FormData>) => {
    return errors[name] ? <small className="p-error">{errors[name]?.message}</small> : null
  }

  const onSubmit = async (data: FormData) => {
    const postData = {
      title: data.title,
      message: content,
      states: data.states,
      recipientRole: data.roles,
    }

    try {
      const response = await requestService({
        path: 'announcements/create',
        method: 'POST',
        body: JSON.stringify(postData),
      })

      if (response.ok) {
        showToast({ severity: 'success', summary: 'Success', detail: 'Announcement created successfully' })
        fetchAnnouncements()
      } else {
        console.error('Failed to create announcement')
        showToast({ severity: 'error', summary: 'Error', detail: 'Failed to create announcement' })
      }
    } catch (error) {
      console.error('Error creating announcement', error)
      showToast({ severity: 'error', summary: 'Error', detail: 'Error creating announcement' })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await requestService({
        path: `announcements/delete/${id}`,
        method: 'DELETE',
      })

      if (response.ok) {
        showToast({ severity: 'success', summary: 'Success', detail: 'Announcement deleted successfully' })
        fetchAnnouncements()
      } else {
        console.error('Failed to delete announcement')
        showToast({ severity: 'error', summary: 'Error', detail: 'Failed to delete announcement' })
      }
    } catch (error) {
      console.error('Error deleting announcement', error)
      showToast({ severity: 'error', summary: 'Error', detail: 'Error deleting announcement' })
    }
  }

  const renderRecipientFilters = (rowData: IAnnouncement) => {
    const { recipient_filters } = rowData
    const { states, roles } = recipient_filters
    return (
      <div>
        <div>
          <strong>States:</strong> {states.join(', ')}
        </div>
        <div>
          <strong>Roles:</strong> {roles.join(', ')}
        </div>
      </div>
    )
  }

  const renderMessage = (rowData: IAnnouncement) => {
    return (
      <div className="max-w-xs whitespace-pre-wrap break-words">
        <div dangerouslySetInnerHTML={{ __html: rowData.message }} />
      </div>
    )
  }

  const renderActions = (rowData: IAnnouncement) => {
    return (
      <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={() => handleDelete(rowData._id)} />
    )
  }

  return isLoading ? (
    <HTLoadingLogo />
  ) : (
    <div>
      {/* Dropdowns for selecting recipients */}
      <div>Select Recipients: </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="states"
          control={control}
          render={({ field, fieldState }) => (
            <MultiSelect
              id={field.name}
              {...field}
              filter
              optionLabel="label"
              options={states}
              display="chip"
              selectAll
              selectAllLabel="Select All"
              maxSelectedLabels={3}
              onChange={(e: MultiSelectChangeEvent) => field.onChange(e.value)}
              placeholder="Select states"
              className={cn({ 'p-invalid': fieldState.invalid }, 'mt-2')}
            />
          )}
        />
        <Controller
          name="roles"
          control={control}
          render={({ field, fieldState }) => (
            <MultiSelect
              id={field.name}
              {...field}
              filter
              optionLabel="title"
              options={roles}
              display="chip"
              selectAll
              selectAllLabel="Select All"
              onChange={(e: MultiSelectChangeEvent) => field.onChange(e.value)}
              placeholder="Select Role of Recipients"
              className={cn({ 'p-invalid': fieldState.invalid }, 'mt-2')}
            />
          )}
        />
        {/* Title input and text editor */}
        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
          <div className="sm:col-span-6 sm:col-start-1">
            <label htmlFor="title" className="block text-sm font-medium leading-6">
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
        </div>
        <div className="card">
          <Editor headerTemplate={header} onTextChange={handleTextChange} value={content} />
          <div className="mt-2 flex justify-end gap-2">
            <Button label="Post" icon="pi pi-check" className="p-button-success" type="submit" />
          </div>
        </div>
      </form>

      {/* DataTable for displaying announcements */}
      <div className="card mt-4">
        <DataTable
          value={announcements}
          paginator
          paginatorLeft={`Total ${announcements.length} Announcements`}
          rows={10}
          rowsPerPageOptions={[10, 20, 30]}
          sortOrder={-1}
          sortField="created_at"
          scrollable
          scrollHeight="calc(100vh - 300px)"
          dataKey="_id"
          className="text-lg"
          resizableColumns
          showGridlines
          tableStyle={{ minWidth: '50rem' }}>
          <Column field="title" header="Title" />
          <Column field="message" header="Message" body={renderMessage} />
          <Column field="recipient_filters" header="Recipient Filters" body={renderRecipientFilters} />
          <Column header="Actions" body={renderActions} />
        </DataTable>
      </div>
    </div>
  )
}
