import { useNavigate, useParams } from 'react-router-dom';
import HeaderComponent from '../../../components/shared/general/HeaderComponent'
import { useState } from 'react';
import { RequestService } from '../../../services/RequestService';
import { useAdmin } from '../../../contexts/AdminContext';
import { Unit } from '../../../interfaces/Unit';



export default function AdminAddUnit() {
    const { unit, setUnit, setModule } = useAdmin()
    const [title, setTitle] = useState<string>('')
    const [time, setTime] = useState<number>(0)
    const params = useParams()
    const navigate = useNavigate()

    const redirectToPreviousPath = (unitId: string = '') => {
        const currentPath = window.location.pathname;
        const newPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
        if (unitId === '') {
            setModule(undefined)
            navigate(newPath);
        } else {
            navigate(newPath + `/${unitId}`);
        }
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
            const response: Unit = await RequestService(url, method, newUnit)
            if (response) {
                setUnit(response)
                redirectToPreviousPath(response._id)

            } else {
                console.error('Error uploading data and image')
                alert('Error Details, Coming soon')
            }
        } catch (error) {
            console.error('Request error:', error)
        }
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
                        </div>
                        <div className="mt-6 flex items-center justify-end gap-x-6">
                            <button
                                type="button"
                                onClick={() => redirectToPreviousPath()}
                                className="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-gray-200">
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleRequest}
                                className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500">
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            </form >
        </div >
    )
}
