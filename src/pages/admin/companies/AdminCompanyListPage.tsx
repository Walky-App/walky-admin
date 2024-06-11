import { useEffect, useMemo, useState } from 'react'

import { GlobalTable } from '../../../components/shared/GlobalTable'
import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { type ICompany } from '../../../interfaces/company'
import { requestService } from '../../../services/requestServiceNew'
import { formatPhoneNumber } from '../../../utils/dataUtils'
import { formatToDateTime } from '../../../utils/timeUtils'

export const AdminCompanyListPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [companies, setCompanies] = useState<ICompany[]>([])
  useEffect(() => {
    setIsLoading(true)
    const getCompanies = async () => {
      try {
        const response = await requestService({ path: 'companies' })
        if (!response.ok) throw new Error('Failed to fetch companies')
        const allCompanies: ICompany[] = await response.json()
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
      { Header: 'Name', accessor: 'company_name' },
      {
        Header: 'DBA',
        width: '200px',
        accessor: (company: ICompany) => company.company_dbas?.join(', ') ?? '',
      },
      { Header: 'Tax ID', accessor: 'company_tax_id' },
      {
        Header: 'Phone',
        accessor: (company: ICompany) =>
          company.company_phone_number?.length ? formatPhoneNumber(company.company_phone_number) : '',
      },
      { Header: 'Payment Information', accessor: (company: ICompany) => company?.payment_information?.length },
      { Header: 'Address', accessor: 'company_address' },
      { Header: 'City', accessor: 'company_city' },
      { Header: 'State', accessor: 'company_state' },
      { Header: 'Zip', accessor: 'company_zip' },
      { Header: 'Facilities', width: '10px', accessor: (company: ICompany) => company.facilities.length },
      {
        Header: 'Created At',
        accessor: (company: ICompany) => (company.createdAt != null ? formatToDateTime(company.createdAt) : ''),
      },
    ],
    [],
  )

  return isLoading ? (
    <HTLoadingLogo />
  ) : (
    <GlobalTable data={memoCompaniesData} columns={memoCompaniesColumns} allowClick />
  )
}
