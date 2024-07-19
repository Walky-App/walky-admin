import { type ICompany } from '../../../interfaces/company'

export const CompanyDocumentsView = ({ selectedCompanyData }: { selectedCompanyData: ICompany }) => {
  const handleLinkPathSplit = (link: string) => {
    const result = link.split('/')
    return result[result.length - 1]
  }
  return (
    <div className="space-y-4 sm:space-y-12">
      <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-12 sm:gap-y-10 md:grid-cols-3">
        {/* <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">Company Information</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Please take a moment to provide the essential information for the company.
          </p>
          {requiredFieldsNoticeText}
        </div> */}

        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
          <div className="sm:col-span-full">
            <div className="mt-8 flow-root">
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
