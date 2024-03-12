import { TabPanel, TabView } from "primereact/tabview"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAdmin } from "../../../contexts/AdminContext"
import { Section } from "../../../interfaces/unit"
import { RequestService } from "../../../services/RequestService"
import { HeaderComponent } from "../../../components/shared/general/HeaderComponent"
import { SectionEditor } from "./components/SectionEditor"
import { SectionImage } from "./components/SectionImage"
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid"
import { DisableButtonInterface } from "../../../interfaces/Global"

export const AdminDetailsUnit = () => {
    const { unit, setUnit, setModule } = useAdmin()
    const [title, setTitle] = useState<string>(unit?.title || '')
    const [time, setTime] = useState<number>(unit?.time ? unit.time / 60 : 0)
    const [sections, setSections] = useState<Section[]>(unit?.sections || [])
    const [selectedSection, setSelectedSection] = useState<Section>()
    const [activeIndex, setActiveIndex] = useState(0)
    const params = useParams()
    const navigate = useNavigate()

    const redirectToPreviousPath = () => {
        const currentPath = window.location.pathname;
        const newPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
        setModule(undefined)
        setUnit(undefined)
        navigate(newPath);
    };

    const handleRequest = async () => {
        if (title === '' || time === 0) {
            alert('Please fill the title and time')
            return
        }
        const newUnit = {
            title,
            time: time * 60,
        }
        try {
            const url = `units/${params.unitId}`
            const method = 'PATCH'

            const response = await RequestService(url, method, newUnit)

            if (response) {
                if (unit) {
                    setUnit(response)
                }
            } else {
                console.error('Error uploading data and image')
                alert('Error Details, Coming soon')
            }
        } catch (error) {
            console.error('Request error:', error)
        }
    }

    const handlerSectionEdit = (section: Section) => {
        if (section.type === 'text') {
            handleTabChange(0)
        } else {
            handleTabChange(1)
        }
        setSelectedSection(section)
    }

    const handlerSectionDelete = async (sectionDelete: Section) => {
        const response = await RequestService(`units/section/disable/${params.unitId}`, 'PATCH', { section: sectionDelete })

        if (response) {
            setSections(response.sections)
        }
    }

    const handleTabChange = (index: number) => {
        setActiveIndex(index);
    }
    const handlerBeforeTabChang = () => {
        setSelectedSection(undefined)
    }

    const deleteSelectedSection = () => {
        setSelectedSection(undefined)
    }

    const fetchData = async () => {
        const response = await RequestService(`units/${params.unitId}`)
        setUnit(response)
        setTitle(response.title)
        setTime(response.time / 60)
        setSections(response.sections)
    }

    const disableButtonData: DisableButtonInterface = {
        path: `units/disable/${unit?._id}`,
        status: unit?.is_disabled as boolean,
        redirect: window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'))
    }

    useEffect(() => {
        if (!unit) {
            fetchData()
        }
    })


    return (
        <div className="w-full sm:overflow-x-hidden">
            <HeaderComponent
                disableButton={disableButtonData}
                title='Unit details'
            />
            <form>
                <div className="space-y-12">
                    <div className=" pb-12">
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="col-span-6 sm:col-span-3">
                                <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="title" >
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
                                            value={title}
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
                                            value={time}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-6 mt-6 flex items-center justify-end gap-x-6">
                                <button
                                    className="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-gray-200"
                                    onClick={redirectToPreviousPath}
                                    type="button"
                                >
                                    Cancel
                                </button>
                                <button
                                    className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                                    onClick={handleRequest}
                                    type="button"
                                >
                                    Update
                                </button>
                            </div>
                            <div className="col-span-6">
                                <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="section_title">
                                    Section management
                                </label>
                                <TabView activeIndex={activeIndex} onBeforeTabChange={handlerBeforeTabChang} onTabChange={(e) => handleTabChange(e.index)} >
                                    <TabPanel header="Text">
                                        <SectionEditor deleteSelectedSection={deleteSelectedSection} section={sections} selectedSection={selectedSection} setSection={setSections} />
                                    </TabPanel>
                                    <TabPanel header="Image">
                                        <SectionImage deleteSelectedSection={deleteSelectedSection} section={sections} selectedSection={selectedSection} setSection={setSections} />
                                    </TabPanel>
                                </TabView>
                            </div>
                            <div className="col-span-6">
                                <label className="block text-sm font-medium leading-6 text-gray-900 mb-4" htmlFor="sections">
                                    Sections
                                </label>
                                <div className='flex flex-wrap gap-1 justify-center'>
                                    <div className="grid grid-cols-1 gap-4 mx-2 sm:grid-cols-2 lg:grid-cols-3">
                                        {
                                            sections.map((section, index) => {
                                                return (
                                                    <div className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow" key={index}>
                                                        <div className="flex w-full items-center justify-between space-x-6 p-6">
                                                            <div className="h-8 w-8 flex rounded-full bg-gray-300 justify-center items-center" >{`#${index + 1}`}</div>
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
                                                                <button className="flex p-2 w-0 flex-1 justify-center items-center cursor-pointer transition-colors duration-300 ease-in-out hover:bg-green-100" onClick={() => handlerSectionEdit(section)} type="button">
                                                                    <PencilSquareIcon aria-hidden="true" className="h-5 w-5 text-gray-400 " />
                                                                    Edit
                                                                </button>
                                                                <button className="-ml-px p-2 flex w-0 flex-1 justify-center items-center cursor-pointer transition-colors duration-300 ease-in-out hover:bg-red-100" onClick={() => handlerSectionDelete(section)} type="button">
                                                                    <TrashIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </form >
        </div >
    )
}

