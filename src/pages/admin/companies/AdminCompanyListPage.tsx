import { useEffect, useState } from 'react'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { type ICompany } from '../../../interfaces/company'
import { requestService } from '../../../services/requestServiceNew'
import { roleChecker } from '../../../utils/roleChecker'
import { CompanyListView } from './CompanyListView'

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

  return isLoading ? <HTLoadingLogo /> : <CompanyListView companies={companies} role={role} />
}
