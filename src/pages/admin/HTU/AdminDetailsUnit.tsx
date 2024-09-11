import { useEffect, useState } from 'react'

import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import { TabPanel, TabView } from 'primereact/tabview'

import { PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid'

import { HeadingComponent } from '../../../components/shared/general/HeadingComponent'
import { useAdmin } from '../../../contexts/AdminContext'
import type { DisableButtonInterface, SelectedOptionInterface } from '../../../interfaces/global'
import type { Section } from '../../../interfaces/unit'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { FormUnits } from './components/FormUnits'
import type { IUnitFormValues } from './components/FormUnits'
import { SectionEditor } from './components/SectionEditor'
import { SectionImage } from './components/SectionImage'

export const unitsType: SelectedOptionInterface[] = [
  {
    name: 'Blog',
    code: 'blog',
  },
  {
    name: 'Video',
    code: 'video',
  },
]
export const unitsTypePrimeReact = [
  {
    title: 'Blog',
    value: 'blog',
  },
  {
    title: 'Video',
    value: 'video',
  },
]

export const AdminDetailsUnit = () => {
  const { unit, setUnit } = useAdmin()
  const [sections, setSections] = useState<Section[]>(unit?.sections || [])
  const [unitTypeChosen, setUnitTypeChosen] = useState<string>(unit?.type || 'blog')
  const [selectedSection, setSelectedSection] = useState<Section>()
  const [activeIndex, setActiveIndex] = useState(0)
  const params = useParams()
  const { showToast } = useUtils()

  const handlerSectionEdit = (section: Section) => {
    if (section.type === 'text') {
      handleTabChange(0)
    } else {
      handleTabChange(1)
    }
    setSelectedSection(section)
  }

  const handlerSectionDelete = async (sectionDelete: Section) => {
    try {
      const response = await requestService({
        path: `units/section/disable/${params.unitId}`,
        method: 'PATCH',
        body: JSON.stringify({ section: sectionDelete }),
      })
      const responseJson = await response.json()
      if (response.ok) {
        setSections(responseJson.sections)
        showToast({ severity: 'success', summary: 'Success', detail: 'Section deleted successfully' })
      }
    } catch (error) {
      showToast({ severity: 'error', summary: 'Error', detail: 'Error deleting section' })
    }
  }

  const handleTabChange = (index: number) => {
    setActiveIndex(index)
  }

  const handlerBeforeTabChang = () => {
    setSelectedSection(undefined)
  }

  const deleteSelectedSection = () => {
    setSelectedSection(undefined)
  }
  const disableButtonData: DisableButtonInterface = {
    path: `units/disable/${unit?._id}`,
    status: unit?.is_disabled as boolean,
    redirect: window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')),
  }

  const defaultValues = {
    title: unit?.title || '',
    time: unit?.time ? unit.time / 60 : 0,
    description: unit?.description || '',
    unitType: unit?.type || 'blog',
    urlVideo: unit?.url_video || '',
    urlCaptions: unit?.url_captions || '',
    urlImage: unit?.url_image || '',
  }

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IUnitFormValues>({ defaultValues })

  const fetchData = async () => {
    try {
      const response = await requestService({ path: `units/${params.unitId}` })
      const unitResponse = await response.json()
      setUnit(unitResponse)
      reset({
        title: unitResponse.title,
        time: unitResponse.time / 60,
        description: unitResponse.description,
        unitType: unitResponse.type,
        urlVideo: unitResponse.url_video,
        urlCaptions: unitResponse.url_captions,
        urlImage: unitResponse.url_image,
      })
      setUnitTypeChosen(unitResponse.type)
      setSections(unitResponse.sections)
    } catch (error) {
      showToast({ severity: 'error', detail: 'Internal error', summary: 'wait a moment and try again' })
    }
  }

  useEffect(() => {
    if (!unit) {
      fetchData()
    }
  })

  return (
    <div className="w-full sm:overflow-x-hidden">
      <HeadingComponent disableButton={disableButtonData} title="Unit details" />
      <FormUnits
        control={control}
        errors={errors}
        handleSubmit={handleSubmit}
        unitTypeChosen={unitTypeChosen}
        setUnitTypeChosen={setUnitTypeChosen}
      />
      <div className="space-y-12">
        <div className="col-span-6">
          <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="section_title">
            Section management
          </label>
          <TabView
            activeIndex={activeIndex}
            onBeforeTabChange={handlerBeforeTabChang}
            onTabChange={e => handleTabChange(e.index)}>
            <TabPanel header="Text">
              <SectionEditor
                deleteSelectedSection={deleteSelectedSection}
                section={sections}
                selectedSection={selectedSection}
                setSection={setSections}
              />
            </TabPanel>
            <TabPanel header="Image">
              <SectionImage
                deleteSelectedSection={deleteSelectedSection}
                section={sections}
                selectedSection={selectedSection}
                setSection={setSections}
              />
            </TabPanel>
          </TabView>
        </div>
        <div className="col-span-6">
          <label className="mb-4 block text-sm font-medium leading-6 text-gray-900" htmlFor="sections">
            Sections
          </label>
          <div className="flex flex-wrap justify-center gap-1">
            <div className="mx-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sections.map((section, index) => {
                return (
                  <div
                    className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
                    key={`unit-details-${index}`}>
                    <div className="flex w-full items-center justify-between space-x-6 p-6">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">{`#${index + 1}`}</div>
                      <div className="flex-1 truncate">
                        <div className="flex items-center space-x-3">
                          <h3 className="truncate text-sm font-medium text-gray-900">{section.title}</h3>
                        </div>
                        <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          {`Type: ${section.type}`}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="-mt-px flex divide-x divide-gray-200">
                        <button
                          className="flex w-0 flex-1 cursor-pointer items-center justify-center p-2 transition-colors duration-300 ease-in-out hover:bg-green-100"
                          onClick={() => handlerSectionEdit(section)}
                          type="button">
                          <PencilSquareIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                          Edit
                        </button>
                        <button
                          className="-ml-px flex w-0 flex-1 cursor-pointer items-center justify-center p-2 transition-colors duration-300 ease-in-out hover:bg-red-100"
                          onClick={() => handlerSectionDelete(section)}
                          type="button">
                          <TrashIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
