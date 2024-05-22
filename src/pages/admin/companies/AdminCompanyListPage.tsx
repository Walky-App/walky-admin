import { useEffect, useMemo, useState } from 'react'

import { GlobalTable } from '../../../components/shared/GlobalTable'
import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { type ICompany } from '../../../interfaces/Company'
import { RequestService } from '../../../services/RequestService'

export const AdminCompanyListPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [companies, setCompanies] = useState<ICompany[]>([])

  useEffect(() => {
    setIsLoading(true)
    const getCompanies = async () => {
      try {
        const allCompanies = await RequestService('companies')
        setCompanies(allCompanies)
      } catch (error) {
        console.error('Error fetching companies', error)
      } finally {
        setIsLoading(false)
      }
    }

    getCompanies()
  }, [])

  const memoCompaniesData = useMemo(() => companies, [companies])

  const memoCompaniesColumns = useMemo(
    () => [
      { Header: 'Corp Name', accessor: 'corp_name' },
      {
        Header: 'DBA',
        accessor: (company: ICompany) => company.company_dbas?.join(', ') ?? '',
      },
      { Header: 'Tax ID', accessor: 'tax_id' },
      { Header: 'Phone Number', accessor: 'phone_number' },
      { Header: 'Payment Information', accessor: (company: ICompany) => company.payment_information.length },
      { Header: 'Country', accessor: 'country' },
      { Header: 'Address', accessor: 'address' },
      { Header: 'City', accessor: 'city' },
      { Header: 'State', accessor: 'state' },
      { Header: 'Zip', accessor: 'zip' },
      { Header: 'Facilities', accessor: (company: ICompany) => company.facilities.length },
      { Header: 'Created At', accessor: 'createdAt' },
    ],
    [],
  )

  return isLoading ? (
    <HTLoadingLogo />
  ) : (
    <>
      <div className="text-right" />
      <GlobalTable data={memoCompaniesData} columns={memoCompaniesColumns} allowClick />
    </>
  )
}
