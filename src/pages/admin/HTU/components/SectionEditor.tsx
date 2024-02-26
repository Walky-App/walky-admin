import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { SectionProps, Section, Unit } from '../../../../interfaces/Unit';
import { useEffect, useState } from "react";
import { RequestService } from "../../../../services/RequestService";
import { useAdmin } from "../../../../contexts/AdminContext";


export default function SectionEditor({ section, setSection, selectedSection, deleteSelectedSection }: SectionProps) {
    const { unit, } = useAdmin()
    const [sectionLocal, setSectionLocal] = useState<string>('')
    const [title, setTitle] = useState<string>('')

    const dataSet = async (section: Section, method: string): Promise<Unit> => {
        const body = {
            unitId: unit?._id,
            section
        }
        try {
            const responseModule: Unit = await RequestService(`units/section`, method, body)
            if (responseModule) {
                return responseModule
            }
        } catch (error) {
            console.error('Request error:', error)
        }
        return {} as Unit;
    }

    const handlerSection = async () => {
        if (title === '' || sectionLocal === '') {
            alert('Please fill the section title and body')
            return
        }
        if (selectedSection) {
            const sectionUpdate: Section = {
                _id: selectedSection._id,
                title: title,
                body: sectionLocal,
                type: 'text'
            }
            const newSection: Unit = await dataSet(sectionUpdate, 'PATCH')
            setSection(newSection.sections)
            deleteSelectedSection()
        } else {
            const dataSection: Section = {
                title: title,
                body: sectionLocal,
                type: 'text'
            }
            const newSection: Unit = await dataSet(dataSection, 'POST')
            setSection(newSection.sections)
            deleteSelectedSection()
        }
        setTitle('')
        setSectionLocal('')
    }

    const handlerCancelEdit = () => {
        deleteSelectedSection()
        setTitle('')
        setSectionLocal('')
    }



    const renderHeader = () => {
        return (
            <>
                <select className="ql-header">
                </select>
                <select className="ql-font">
                </select>
                <span className="ql-formats">
                    <button className="ql-bold" aria-label="Bold"></button>
                    <button className="ql-italic" aria-label="Italic"></button>
                    <button className="ql-underline" aria-label="Underline"></button>
                </span>
                <span className="ql-formats">
                    <select className="ql-color" ></select>
                    <button className="ql-list" value="ordered"></button>
                    <button className="ql-list" value="bullet"></button>
                    <select className="ql-align"></select>
                </span>
                <span className="ql-formats">
                    <button className="ql-link"></button>
                    <button className="ql-video"></button>
                </span>
            </>
        );
    };

    const header = renderHeader();

    useEffect(() => {
        if (selectedSection) {
            setTitle(selectedSection.title)
            setSectionLocal(selectedSection.body)
        }
    }, [selectedSection])


    return (
        <>
            <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-600 ">
                    <input
                        type="text"
                        name="section_title"
                        value={title}
                        id="section_title"
                        onChange={e => setTitle(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                        placeholder="Section title"
                    />
                </div>
            </div>
            <div className="mt-4">
                <div className="card">
                    <Editor value={sectionLocal} onTextChange={(e: EditorTextChangeEvent) => setSectionLocal(e.htmlValue as string)}
                        headerTemplate={header}
                    />

                    <div className='flex justify-end mt-2 gap-2'>
                        {
                            selectedSection && <button
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
                            {selectedSection ? 'Edit' : 'Add'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
