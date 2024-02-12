import { useNavigate, useParams } from "react-router-dom"
import { FileInput } from "flowbite-react"
import { ChangeEvent, useEffect, useState } from "react"
import { XMarkIcon } from "@heroicons/react/20/solid"
import { useAuth } from "../../../../contexts/AuthContext"
import { TagsInterface } from "../../../../interfaces/Global"
import HeaderComponent from "../../../../components/shared/general/HeaderComponent"
import TagsArray from "./TagsArray"
import { Category } from "../../../../interfaces/Category"
import { getModifiedProperties } from "../../../../utils/FunctionUtils"

interface Props {
    action: "add" | "edit"
    category?: Category
}

export default function FormCategory({ action, category }: Props) {
    const { user } = useAuth()
    const [title, setTitle] = useState<string>(category?.title || '')
    const [description, setDescription] = useState<string>(category?.description || '')
    const [image, setImage] = useState<File | null>(null)
    const [tags, setTags] = useState<TagsInterface[]>(category?.state_tags || [])
    const [imagePreview, setImagePreview] = useState<string | undefined>(category?.image || undefined);
    const navigate = useNavigate()

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setImage(event.target.files[0])
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

    const handleUpload = async () => {
        if (!image && action === 'add') {
            console.error('No image selected')
            alert('No image selected')
            return
        }

        const formData = new FormData()

        if (action === 'edit') {
            const differences: Partial<Category> = getModifiedProperties(category, { title, description, state_tags: tags, image });

            for (const key of Object.keys(differences)) {
                if (key === 'state_tags') {
                    formData.append('state_tags', JSON.stringify(tags))
                } else if (key === 'image') {
                    formData.append('image', image as File)
                } else {
                    formData.append(key, String(differences[key as keyof Category]));
                }
            }
        } else {
            formData.append('image', image as File)
            formData.append('title', title)
            formData.append('description', description)
            formData.append('state_tags', JSON.stringify(tags))
        }

        try {
            const url = action === 'add' ? `${process.env.REACT_APP_PUBLIC_API}/categories` : `${process.env.REACT_APP_PUBLIC_API}/categories/${category?._id}`
            const method = action === 'add' ? 'POST' : 'PATCH'
            const response = await fetch(url, {
                method: method,
                headers: {
                    Authorization: `Bearer ${user?.access_token}`,
                },
                body: formData,
            })

            if (response.ok) {
                console.log('Data and image uploaded successfully')
                navigate('/admin/learn/categories')
            } else {
                console.error('Error uploading data and image')
                alert('Error Details, Coming soon')
            }
        } catch (error) {
            console.error('Request error:', error)
        }
    }

    const handleRemoveImage = () => {
        setImagePreview(undefined);
    };


    return (
        <form>
            <div className="space-y-12">
                <div className=" pb-12">
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                            <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                                Title
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-600 sm:max-w-md">
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                        placeholder="category title"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                                Description
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    value={description}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="category description"
                                />
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900 mb-3">
                                categoy photo
                            </label>
                            {imagePreview ? (
                                <div className="relative inline-block">
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
                        </div>

                        <div className="col-span-full">
                            <TagsArray tags={tags} setTags={setTags} optional />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button type="button"
                    onClick={() => {
                        navigate('/admin/learn/categories')
                    }}
                    className="text-sm font-semibold leading-6 text-gray-900">
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleUpload}
                    className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    {action === 'add' ? 'Create' : 'Update'}
                </button>
            </div>
        </form>
    )
}
