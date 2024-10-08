import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { HtInputLabel } from '../../../components/shared/forms/HtInputLabel'
import { HtFileUpload } from '../../../components/shared/general/HtFileUpload'
import { type ICompany } from '../../../interfaces/company'
import { requestService } from '../../../services/requestServiceNew'

export const CompanyDocumentsView = ({
  selectedCompanyData,
  setSelectedCompanyData,
}: {
  selectedCompanyData: ICompany
  setSelectedCompanyData: React.Dispatch<React.SetStateAction<ICompany>>
}) => {
  const [isNewFileUploaded, setIsNewFileUploaded] = useState(false)

  const selectedCompanyId = useParams().id ?? ''

  useEffect(() => {
    const getCompanyWithPaymentInfo = async () => {
      try {
        const response = await requestService({ path: `companies/${selectedCompanyId}/payments` })
        if (!response.ok) {
          throw new Error('Failed to fetch company data')
        }
        const companyFound: ICompany = await response.json()
        setSelectedCompanyData(companyFound)
      } catch (error) {
        console.error('Error fetching company data: ', error)
      } finally {
        setIsNewFileUploaded(false)
      }
    }
    getCompanyWithPaymentInfo()
  }, [selectedCompanyId, setSelectedCompanyData, isNewFileUploaded])

  const handleLinkPathSplit = (link: string) => {
    const result = link.split('/')
    return result[result.length - 1]
  }
  return (
    <div className="space-y-4 sm:space-y-12">
      <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-12 sm:gap-y-10 md:grid-cols-3">
        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
          <div className="mt-4 sm:col-span-full">
            <div className="space-y-2">
              <HtInputLabel htmlFor="company_document_upload" labelText="Upload Company Documents:" />
              <HtFileUpload
                inputId="company_document_upload"
                path={`companies/${selectedCompanyId}/documents`}
                acceptMultipleFiles={false}
                mode="basic"
                onUploadSuccess={async () => setIsNewFileUploaded(true)}
              />
            </div>
            <div className="mt-6 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                          Link
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Uploaded On
                        </th>
                        {/* <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Uploaded by
                        </th> */}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedCompanyData?.company_documents?.map(document => (
                        <tr key={document.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            <a
                              href={document.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline  hover:text-gray-600">
                              {handleLinkPathSplit(document.key)}
                            </a>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <time>{new Date(document.timestamp).toLocaleString()}</time>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{document.id}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">-</td>
                          {/* <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                            <Button
                              label="Delete"
                              severity="secondary"
                              outlined
                              size="small"
                              onClick={() => handleDelete(document.key ?? '', document._id ?? '')}
                            />
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
