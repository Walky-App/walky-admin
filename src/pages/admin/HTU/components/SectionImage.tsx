import { Section, SectionProps } from '../../../../interfaces/Unit'
import { ChangeEvent, useEffect, useState } from 'react';
import { RequestService } from '../../../../services/RequestService';
import { Editor, EditorTextChangeEvent } from 'primereact/editor';
import { FileInput } from 'flowbite-react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function SectionImage({ section, setSection, selectedSection, deleteSelectedSection }: SectionProps) {
    const [title, setTitle] = useState<string>('')
    const [image, setImage] = useState<string>('')
    const [text, setText] = useState<string>('')
    const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);

    const renderHeader = () => {
        return (
            <>
                <select className="ql-header">
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
            </>
        );
    };

    const header = renderHeader();

    const handlerSection = () => {
        if (title === '' || image === '' || text === '') {
            alert('Please fill the section title and image or body')
            return
        }
        const body: string = text + image
        if (selectedSection) {
            const sectionUpdate: Section = {
                title: title,
                body: body,
                type: 'image'
            }
            const index = section.findIndex(section => JSON.stringify(section));
            if (index !== -1) {
                const newArray = [...section];
                newArray[index] = sectionUpdate;
                setSection(newArray);
            }
        } else {
            setSection([...section, {
                title: title,
                body: body,
                type: 'image'
            }])
        }

        setTitle('')
        setImage('')
        setText('')
        setImagePreview(undefined);
    }

    const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const image = event.target.files[0]

            const formData = new FormData()
            formData.append('image', image as File)

            try {
                const response = await RequestService('units/section/image', 'POST', formData, 'form-data');
                if (response) {
                    setImage(
                        `<div className='w-9/12 mt-2'> <img className='object-cover rounded-xl' src="${response.fileUrl}" alt="${response.originalname}"/></div>`
                    )
                } else {
                    console.error('Error uploading data and image')
                    alert('Error Details, Coming soon')
                }
            } catch (error) {
                console.error('Request error:', error)
            }
        }
        const file = event.target.files && event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(undefined);
        }
    }


    const handleRemoveImage = () => {
        setImagePreview(undefined);
    };

    const handlerCancelEdit = () => {
        deleteSelectedSection()
        setTitle('')
        setText('')
        setImage('')
        setImagePreview(undefined);
    }


    useEffect(() => {
        if (selectedSection) {
            const parts = selectedSection.body.split("<div className='w-9/12 mt-2'>");
            const regex = /src="([^"]*)"/;
            const regexAlt = /alt="([^"]*)"/;
            const match = parts[1].match(regex);
            const matchAlt = parts[1].match(regexAlt);
            const srcAttributeValue = match ? match[1] : null;
            const altAttributeValue = matchAlt ? matchAlt[1] : null;
            setTitle(selectedSection.title)
            setText(parts[0])
            setImage(
                `<div className='w-9/12 mt-2'> <img className='object-cover rounded-xl' src="${srcAttributeValue}" alt="${altAttributeValue}"/></div>`
            )
            setImagePreview(srcAttributeValue as string)
        }
    }, [selectedSection])
    return (
        <>
            <div className="my-2">
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
            <div className="card">
                <Editor value={text} onTextChange={(e: EditorTextChangeEvent) => setText(e.htmlValue as string)}
                    headerTemplate={header}
                />

            </div>

            {imagePreview ? (
                <div className="relative inline-block mt-4">
                    <img src={imagePreview} alt="Preview" className="max-w-52 object-cover object-center rounded-xl shadow-xl" />
                    <button onClick={handleRemoveImage} className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 text-white bg-red-500 hover:text-red-500 hover:bg-white transition-colors duration-300 rounded-full p-1">
                        <XMarkIcon className=" h-4 w-4" />
                    </button>
                </div>
            ) : (<FileInput
                className="mt-3"
                accept="image/png, image/gif, image/jpeg"
                onChange={handleImageChange}
                id="file-upload-helper-text"
                helperText="PNG or JPG."
            />)}
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
        </>
    )
}
