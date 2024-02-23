import { useNavigate, useParams } from 'react-router-dom';
import HeaderComponent from '../../../components/shared/general/HeaderComponent'
import { useState } from 'react';
import TemplateEditor from './components/SectionEditor';
import { Section } from '../../../interfaces/Unit';
import { Card } from 'flowbite-react';
import { RequestService } from '../../../services/RequestService';
import { useAdmin } from '../../../contexts/AdminContext';
import { Module } from '../../../interfaces/Module';
import { TabPanel, TabView, TabViewTabChangeEvent } from 'primereact/tabview';
import SectionImage from './components/SectionImage';



export default function AdminAddUnit() {
    const { module, setModule } = useAdmin()
    const [title, setTitle] = useState<string>('')
    const [time, setTime] = useState<number>(0)
    const [sections, setSections] = useState<Section[]>([])
    const [mode, setMode] = useState<string>('add')
    const [sectionTitle, setSectionTitle] = useState<string>('')
    const [templateEditor, setTemplateEditor] = useState<string>('')
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
            moduleId: params.idModule,
            title,
            time: time * 60,
            sections
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

    const handlerSection = () => {
        if (sectionTitle === '' || templateEditor === '') {
            alert('Please fill the section title and body')
            return
        }
        if (mode === 'edit') {
            const sectionUpdate = {
                title: sectionTitle,
                body: templateEditor
            }
            const index = sections.findIndex(section => JSON.stringify(section));
            if (index !== -1) {
                const newArray = [...sections];
                newArray[index] = sectionUpdate;
                setSections(newArray);
            }
            setMode('add')
        } else {
            setSections(prev => {
                return [...prev, {
                    title: sectionTitle,
                    body: templateEditor
                }]
            })
        }
        setSectionTitle('')
        setTemplateEditor('')
    }

    const handlerCancelEdit = () => {
        setMode('add')
        setSectionTitle('')
        setTemplateEditor('')
    }

    const handlerSectionEdit = (section: Section) => {
        setSectionTitle(section.title)
        setTemplateEditor(section.body)
        setMode('edit')
    }

    const handlerSectionDelete = (sectionDelete: Section) => {
        const newSection = sections.filter(section => JSON.stringify(section) !== JSON.stringify(sectionDelete));
        setSections(newSection)
    }

    const handlerTabChange = (event: TabViewTabChangeEvent) => {
        console.log(event.index)
        console.log(event.originalEvent.currentTarget.textContent)
    }

    return (
        <div className="w-full sm:overflow-x-hidden">
            <HeaderComponent
                title={'Create Unit'}
            />
            <form>
                <div className="space-y-12">
                    <div className=" pb-12">
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <span>Type: blog</span>
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                                    Title
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-600 ">
                                        <input
                                            type="text"
                                            name="title"
                                            id="title"
                                            onChange={e => setTitle(e.target.value)}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                            placeholder="Unit title"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="reading_time" className="block text-sm font-medium leading-6 text-gray-900">
                                    Reading time
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-600 ">
                                        <input
                                            type="number"
                                            name="reading_time"
                                            id="reading_time"
                                            min={0}
                                            onChange={e => setTime(Number(e.target.value))}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                            placeholder="x minutes"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-6">
                                <label htmlFor="section_title" className="block text-sm font-medium leading-6 text-gray-900">
                                    Create section
                                </label>
                                <TabView onBeforeTabChange={handlerTabChange}>
                                    <TabPanel header="Text">
                                        <div className="mt-2">
                                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-600 ">
                                                <input
                                                    type="text"
                                                    name="section_title"
                                                    value={sectionTitle}
                                                    id="section_title"
                                                    onChange={e => setSectionTitle(e.target.value)}
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                                    placeholder="Section title"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <TemplateEditor section={templateEditor} setSection={setTemplateEditor} />
                                            <div className='flex justify-end mt-2 gap-2'>
                                                {
                                                    mode === 'edit' && <button
                                                        type="button"
                                                        onClick={handlerCancelEdit}
                                                        className="rounded-md text-sm  px-3 py-2 font-semibold leading-6 text-black bg-gray-200">
                                                        Cancel
                                                    </button>
                                                }

                                                <button
                                                    type="button"
                                                    onClick={handlerSection}
                                                    className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500">
                                                    {mode === 'add' ? 'Add' : 'Edit'}
                                                </button>
                                            </div>
                                        </div>
                                    </TabPanel>
                                    <TabPanel header="Image">
                                        <div className="mt-2">
                                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-600 ">
                                                <input
                                                    type="text"
                                                    name="section_title"
                                                    value={sectionTitle}
                                                    id="section_title"
                                                    onChange={e => setSectionTitle(e.target.value)}
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                                    placeholder="Section title"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <SectionImage section={templateEditor} setSection={setTemplateEditor} />
                                            <div className='flex justify-end mt-2 gap-2'>
                                                {
                                                    mode === 'edit' && <button
                                                        type="button"
                                                        onClick={handlerCancelEdit}
                                                        className="rounded-md text-sm  px-3 py-2 font-semibold leading-6 text-black bg-gray-200">
                                                        Cancel
                                                    </button>
                                                }

                                                <button
                                                    type="button"
                                                    onClick={handlerSection}
                                                    className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500">
                                                    {mode === 'add' ? 'Add' : 'Edit'}
                                                </button>
                                            </div>
                                        </div>
                                    </TabPanel>
                                </TabView>
                            </div>
                            <div className="col-span-6">
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    Sections
                                </label>
                                <div className='flex flex-wrap gap-1 justify-center'>
                                    {
                                        sections.map((section, index) => {
                                            return (
                                                <Card key={index} className='w-1/5'>
                                                    <p className="m-0">
                                                        #{index + 1} {section.title}
                                                    </p>
                                                    <div className='flex flex-row justify-between'>
                                                        <button type='button' onClick={() => handlerSectionEdit(section)} className='rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500'>edit</button>
                                                        <button type='button' onClick={() => handlerSectionDelete(section)} className='rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500'>delete</button>
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

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                        type="button"
                        onClick={redirectToPreviousPath}
                        className="text-sm font-semibold leading-6 text-gray-900">
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleRequest}
                        className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500">
                        {'Create'}
                    </button>
                </div>
            </form >
        </div >
    )
}
