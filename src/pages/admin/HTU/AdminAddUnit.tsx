import { useNavigate, useParams } from 'react-router-dom';
import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'
import { useState } from 'react';
import { RequestService } from '../../../services/RequestService';
import { useAdmin } from '../../../contexts/AdminContext';
import { Unit } from '../../../interfaces/Unit';



export const AdminAddUnit = () => {
    const { setUnit, setModule } = useAdmin()
    const [title, setTitle] = useState<string>('')
    const [time, setTime] = useState<number>(0)
    const params = useParams()
    const navigate = useNavigate()

    const redirectToPreviousPath = (unitId = '') => {
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
                title='Create Unit'
            />
            <form>
                <div className="space-y-12">
                    <div className=" pb-12">
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="col-span-6 sm:col-span-3">
                                <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="title">
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
                        </div>
                        <div className="mt-6 flex items-center justify-end gap-x-6">
                            <button
                                className="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-gray-200"
                                onClick={() => redirectToPreviousPath()}
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
                    </div>
                </div>
            </form >
        </div >
    )
}
