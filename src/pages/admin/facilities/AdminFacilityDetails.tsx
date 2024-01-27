import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RequestService } from '../../../services/RequestService';
import { CheckCircleIcon, PhotoIcon } from '@heroicons/react/20/solid';

export default function AdminFacilityDetails() {
    const { facilityId } = useParams();
    const [formFacility, setFormFacility] = useState<any>({});
    const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

    useEffect(() => {
        const getFacility = async () => {
            try {
                const facilityFound = await RequestService(`facilities/${facilityId}`);
                setFormFacility(facilityFound);
            } catch (error) {
                console.error("Error fetching facility data:", error);
            }
        };
        getFacility();
    }, [facilityId]);

    const handleInputChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        const inputValue = type === 'checkbox' ? checked : value;
        setFormFacility((prevFormFacility: any) => ({
            ...prevFormFacility,
            [name]: inputValue,
        }));
    };

    const handleUpdate = async (e: any) => {
        console.log('formFacility -->', formFacility);
        e.preventDefault();
        try {
            console.log('facilityID -->', facilityId)
            const res = await RequestService(`facilities/${facilityId}`, 'PATCH', formFacility);
            setFormFacility(res);
            console.log('formFacility -->', formFacility)
            setUpdateSuccess(true);
            console.log('update success -->', updateSuccess)
            setTimeout(() => setUpdateSuccess(false), 5000);
        } catch (error) {
            console.error("Error updating facility data:", error);
            setUpdateSuccess(false);
        }
    };

    if (!formFacility) {
        return <div>Loading...</div>;
    }
return (
    <>
        <form onSubmit={handleUpdate}>
            <div className="space-y-12">
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                    <div>
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                            Business Information
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Please provide information about your business so that we can verify you on the
                            platform.{' '}
                        </p>
                    </div>

                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="tax-id"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Tax ID
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="tax_id"
                                    id="tax-id"
                                    autoComplete="tax-id"
                                    value={formFacility.tax_id || ''}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-green-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Facility Name
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formFacility.name || ''}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-green-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="phone-number"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Business Contact Mobile Number*
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="phone_number"
                                    id="phone-number"
                                    autoComplete="phone-number"
                                    value={formFacility.phone_number || ''}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-green-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label
                                htmlFor="first-name"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Business Contact First Name*
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="first_name"
                                    id="first-name"
                                    autoComplete="first-name"
                                    value={formFacility.first_name || ''}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-green-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="first-name"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Business Contact Last Name*
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="last_name"
                                    id="last-name"
                                    autoComplete="last-name"
                                    value={formFacility.last_name || ''}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-green-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label
                                htmlFor="first-name"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Facility Square Footage
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="sqft"
                                    id="sqft"
                                    autoComplete="sqft"
                                    value={formFacility.sqft || ''}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-green-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label
                                htmlFor="role"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Business Contact Designation
                            </label>
                            <div className="mt-2">
                                <select
                                    id="role"
                                    name="role"
                                    autoComplete="role"
                                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-green-600 sm:max-w-xs sm:text-sm sm:leading-6">
                                    <option>Owner</option>
                                    <option>Manager</option>
                                </select>
                            </div>
                        </div>

                        {/* Section 2 */}

                        <div className="col-span-full">
                            <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                                Notes
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="about"
                                    name="notes"
                                    rows={5}
                                    value={formFacility.notes || ''}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-green-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <p className="mt-3 text-sm leading-6 text-gray-600">
                                Write notes about the facility.
                            </p>
                        </div>

                        <div className="col-span-full">
                            <label
                                htmlFor="facility-photo"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Facility photo
                            </label>
                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                <div className="text-center">
                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer rounded-md bg-white font-semibold text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-600 focus-within:ring-offset-2 hover:text-green-500">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="main_image" type="file" className="sr-only" />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* section two */}

                <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                    <div>
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Business Location</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Please provide your business address information below.
                        </p>
                    </div>

                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="country"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Country
                            </label>
                            <div className="mt-2">
                                <select
                                    id="country"
                                    name="country"
                                    autoComplete="country-name"
                                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-green-600 sm:max-w-xs sm:text-sm sm:leading-6">
                                    <option>United States</option>
                                    <option>Canada</option>
                                    <option>Mexico</option>
                                </select>
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label
                                htmlFor="last-name"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Street Address
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="address"
                                    id="address"
                                    value={formFacility.address || ''}
                                    onChange={handleInputChange}
                                    autoComplete="address"
                                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-green-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2 sm:col-start-1">
                            <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                                City
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="city"
                                    id="city"
                                    value={formFacility.city || ''}
                                    onChange={handleInputChange}
                                    autoComplete="address-level2"
                                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-green-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
                                State / Province
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="state"
                                    id="state"
                                    value={formFacility.state || ''}
                                    onChange={handleInputChange}
                                    autoComplete="address-level1"
                                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-green-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label
                                htmlFor="postal-code"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                ZIP / Postal code
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="zip"
                                    id="zip"
                                    value={formFacility.zip || ''}
                                    onChange={handleInputChange}
                                    autoComplete="postal-code"
                                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-green-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                    <div>
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                            Business License Document
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Please upload your business license documents. Please make sure your upload is clear
                            without any warped or blur portions and shows all relevant information.{' '}
                        </p>
                    </div>

                    {/* section 3 */}

                    <div className="max-w-2xl space-y-10 md:col-span-2">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">
                                Upload State License Document*
                            </legend>
                            <div className="col-span-full">
                                <label
                                    htmlFor="cover-photo"
                                    className="block text-sm font-medium leading-6 text-gray-900">
                                    State License
                                </label>
                                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                    <div className="text-center">
                                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer rounded-md bg-white font-semibold text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-600 focus-within:ring-offset-2 hover:text-green-500">
                                                <span>Upload a file</span>
                                                <input
                                                    id="state_license"
                                                    name="state_license"
                                                    type="file"
                                                    className="sr-only"
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                            </div>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">
                                Upload City License Document*
                            </legend>
                            <div className="col-span-full">
                                <label
                                    htmlFor="cover-photo"
                                    className="block text-sm font-medium leading-6 text-gray-900">
                                    City License
                                </label>
                                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                    <div className="text-center">
                                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer rounded-md bg-white font-semibold text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-600 focus-within:ring-offset-2 hover:text-green-500">
                                                <span>Upload a file</span>
                                                <input
                                                    id="city_license"
                                                    name="city_license"
                                                    type="file"
                                                    className="sr-only"
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                {updateSuccess && (
                    <div className="rounded-md bg-green-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">Facility successfully updated</p>
                            </div>
                            <div className="ml-auto pl-3">
                                <div className="-mx-1.5 -my-1.5">
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                    Cancel
                </button>
                <button
                    type="submit"
                    className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                    Update
                </button>
            </div>
        </form>


    </>
)
}
