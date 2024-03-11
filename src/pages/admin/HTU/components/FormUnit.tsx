import { TabPanel, TabView } from "primereact/tabview"
import { SectionEditor } from "./SectionEditor"
import { SectionImage } from "./SectionImage"
import { Card } from "flowbite-react"
import { HeaderComponent } from "../../../../components/shared/general/HeaderComponent"
import { Section } from "../../../../interfaces/unit"
import { Module } from "../../../../interfaces/Module"
import { RequestService } from "../../../../services/RequestService"
import { useNavigate, useParams } from "react-router-dom"
import { useState } from "react"
import { useAdmin } from "../../../../contexts/AdminContext"

export const FormUnit = () => {
    const { module, setModule } = useAdmin()
    const [title, setTitle] = useState<string>('')
    const [time, setTime] = useState<number>(0)
    const [sections, setSections] = useState<Section[]>([])
    const [selectedSection, setSelectedSection] = useState<Section>()
    const [activeIndex, setActiveIndex] = useState(0)
    const params = useParams()
    const navigate = useNavigate()

    const redirectToPreviousPath = () => {
        const currentPath = window.location.pathname;
        const newPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
        navigate(newPath);
    };

    const handleRequest = async () => {
        if (title === '' || time === 0) {
            alert('Please fill the title and time')
            return
        }
        const newUnit = {
            moduleId: params.moduleId,
            title,
            time: time * 60,
        }
        try {
            const url = 'units'
            const method = 'POST'

            const response = await RequestService(url, method, newUnit)

            if (response) {
                if (module) {
                    const moduleUpdate: Module = {
                        ...module,
                        units: module.units ? [...module.units, response] : [response]
                    }
                    setModule(moduleUpdate)
                }
                redirectToPreviousPath()

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

    const handlerSectionDelete = (sectionDelete: Section) => {
        const newSection = sections.filter(section => JSON.stringify(section) !== JSON.stringify(sectionDelete));
        setSections(newSection)
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

    return (
        <div className="w-full sm:overflow-x-hidden">
            <HeaderComponent
                title='Create Unit'
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
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="reading_time" >
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
                            <div className="mt-6 flex items-center justify-end gap-x-6">
                                <button
                                    className="text-sm font-semibold leading-6 text-gray-900"
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
                                    Create
                                </button>
                            </div>
                            <div className="col-span-6">
                                <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="section_title" >
                                    Create section
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
                                <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="sections">
                                    Sections
                                </label>
                                <div className='flex flex-wrap gap-1 justify-center'>
                                    {
                                        sections.map((section, index) => {
                                            return (
                                                <Card className='w-1/5' key={index} >
                                                    <p className="m-0">
                                                        #{index + 1} {section.title}
                                                    </p>
                                                    <div className='flex flex-row justify-between'>
                                                        <button className='rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500' onClick={() => handlerSectionEdit(section)} type='button'  >edit</button>
                                                        <button className='rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500' onClick={() => handlerSectionDelete(section)} type='button'  >delete</button>
                                                    </div>
                                                </Card>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </form >
        </div >
    )
}

