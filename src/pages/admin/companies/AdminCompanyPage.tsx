import { useState, useEffect, createContext, useContext } from 'react'

import { Outlet, useParams } from 'react-router-dom'

import { Skeleton } from 'primereact/skeleton'

import { type SubHeaderData, SubHeader } from '../../../components/shared/SubHeader'
import { type ICompany } from '../../../interfaces/companyTypes'
import { requestService } from '../../../services/requestServiceNew'
import { adminCompanyLinks } from './adminCompanySubHeaderLinks'

interface IAdminCompanyPageContext {
  selectedCompanyData: ICompany
  selectedCompanyId?: string
}

const AdminCompanyPageContext = createContext<IAdminCompanyPageContext>({} as IAdminCompanyPageContext)

export const useAdminCompanyPageContext = () => {
  return useContext(AdminCompanyPageContext)
}

export const AdminCompanyPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCompanyData, setSelectedCompanyData] = useState<ICompany>({} as ICompany)

  const selectedCompanyId = useParams().id

  useEffect(() => {
    const getCompany = async () => {
      try {
        const response = await requestService({ path: `companies/${selectedCompanyId}` })
        if (!response.ok) {
          throw new Error('Failed to fetch company data')
        }
        const companyFound: ICompany = await response.json()
        setSelectedCompanyData(companyFound)
      } catch (error) {
        console.error('Error fetching company data: ', error)
      } finally {
        setIsLoading(false)
      }
    }
    getCompany()
  }, [selectedCompanyId])

  const subheaderUserDetails: SubHeaderData = {
    _id: selectedCompanyData?._id,
    corp_name: selectedCompanyData?.corp_name,
    dba: selectedCompanyData?.company_dbas?.join(', ') ?? '',
    address: selectedCompanyData?.address,
  }

  return (
    <AdminCompanyPageContext.Provider value={{ selectedCompanyId, selectedCompanyData }}>
      {isLoading ? (
        <Skeleton width="100%" height="100%" />
      ) : (
        <>
          <SubHeader data={subheaderUserDetails} links={adminCompanyLinks} />
          <Outlet />
        </>
      )}
    </AdminCompanyPageContext.Provider>
  )
}
