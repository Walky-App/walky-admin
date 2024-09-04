import { useEffect, useMemo, useState } from 'react'

import { format, isToday, isYesterday } from 'date-fns'

import { GlobalTable } from '../../../components/shared/GlobalTable'
import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { type ICompany } from '../../../interfaces/company'
import { requestService } from '../../../services/requestServiceNew'
import { formatPhoneNumber } from '../../../utils/dataUtils'
import { roleChecker } from '../../../utils/roleChecker'

export const AdminCompanyListPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [companies, setCompanies] = useState<ICompany[]>([])
  const role = roleChecker()

  useEffect(() => {
    setIsLoading(true)
    const getCompanies = async () => {
      try {
        let response
        if (role === 'client') {
          response = await requestService({ path: 'companies/byclient' })
          if (!response.ok) throw new Error('Failed to fetch companies')
          const { companies: clientCompanies } = await response.json()
          setCompanies(clientCompanies)
        } else {
          response = await requestService({ path: 'companies' })
          if (!response.ok) throw new Error('Failed to fetch companies')
          const allCompanies: ICompany[] = await response.json()
          setCompanies(allCompanies)
        }
      } catch (error) {
        console.error('Error fetching companies', error)
      } finally {
        setIsLoading(false)
      }
    }

    getCompanies()
  }, [role])

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
        Header: 'Created',
        width: 200,
        accessor: (a: ICompany) => {
          return isToday(a.createdAt as string)
            ? 'Today'
            : isYesterday(a.createdAt as string)
              ? 'Yesterday'
              : format(a.createdAt as string, 'P')
        },
      },
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
    ],
    [],
  )

  return isLoading && memoCompaniesData.length > 0 ? (
    <HTLoadingLogo />
  ) : (
    <GlobalTable data={memoCompaniesData} columns={memoCompaniesColumns} allowClick />
  )
}
