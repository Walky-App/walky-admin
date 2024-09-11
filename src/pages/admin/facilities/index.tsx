import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { format } from 'date-fns'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { type ICompany } from '../../../interfaces/company'
import { type IFacility } from '../../../interfaces/facility'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'
import { exportToExcelTable } from '../../../utils/primeReactUtils'
import { roleChecker } from '../../../utils/roleChecker'

interface IFacilityWithPaymentInfo {
  company_id: ICompany
}

export const AdminFacilities = () => {
  const [facilities, setFacilities] = useState<IFacility[]>([])
  const { showToast } = useUtils()

  const [globalFilter, setGlobalFilter] = useState<string>('')
  const navigate = useNavigate()
  const role = roleChecker()

  useEffect(() => {
    const getFacilities = async () => {
      try {
        const response = await requestService({ path: 'facilities/with-company-info' })

        if (response.ok) {
          const data = await response.json()
          setFacilities(data)
        }
      } catch (error) {
        console.error(error)
        showToast({ severity: 'error', summary: 'Error', detail: 'Error loading facilities' })
      }
    }

    getFacilities()
  }, [showToast])

  const getHeader = () => {
    return (
      <div className="justify-content-end flex">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            type="search"
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
          />
        </IconField>
      </div>
    )
  }

  const imageBodyTemplate = (facility: IFacility) => {
    return (
      <img
        src={facility.main_image ? facility.main_image : '/assets/photos/no-photo-found.jpg'}
        alt={facility.main_image}
        className="h-32 w-32 rounded-md object-cover"
      />
    )
  }

  const paginatorRight = (
    <Button type="button" icon="pi pi-download" text onClick={() => exportToExcelTable(facilities, 'facilities')} />
  )

  return (
    <div className="card text-2xl">
      {facilities.length === 0 ? (
        <HTLoadingLogo />
      ) : (
        <DataTable
          value={facilities}
          paginator
          paginatorLeft={`Total ${facilities.length} Facilities`}
          paginatorRight={paginatorRight}
          rows={30}
          rowsPerPageOptions={[30, 40, 50]}
          sortOrder={-1}
          sortField="createdAt"
          scrollable
          scrollHeight="calc(100vh - 300px)"
          frozenWidth="200px"
          dataKey="_id"
          className="text-lg"
          globalFilter={globalFilter}
          header={getHeader()}
          resizableColumns
          showGridlines
          tableStyle={{ minWidth: '50rem' }}>
          <Column header="Image" body={imageBodyTemplate} />
          <Column
            field="name"
            header="Name"
            body={facility => (
              <Button
                label={facility.name}
                className="p-button-text"
                onClick={() => navigate(`/${role}/facilities/${facility._id}`)}
              />
            )}
          />
          <Column
            field="facility.location_polygon"
            header="Polygon Set"
            body={(facility: IFacility) => (facility?.location_polygon ? '✅' : '❌')}
          />
          <Column
            field="facility.licenses"
            header="Licenses"
            body={(facility: IFacility) => (facility?.licenses ? '✅' : '❌')}
          />
          <Column
            field="facility.company_id.payment_information"
            header="Payment Info"
            body={(facility: IFacilityWithPaymentInfo) =>
              facility?.company_id?.payment_information?.length ? '✅' : '❌'
            }
          />
          <Column
            field="isApproved"
            header="Approved"
            body={(facility: IFacility) => (facility.isApproved ? '✅' : '❌')}
          />
          <Column field="active" header="Active" body={(facility: IFacility) => (facility.active ? '✅' : '❌')} />
          <Column field="city" header="City" />
          <Column field="state" header="State" />
          <Column
            field="company_id.company_name"
            header="Company"
            body={facility => (
              <Button
                label={`${facility.name} (${facility.company_id.company_dbas.join(', ')})`}
                className="p-button-text"
                onClick={() => navigate(`/${role}/companies/${facility.company_id._id}`)}
              />
            )}
          />
          <Column
            field="createdAt"
            header="Created Date"
            body={(company: ICompany) =>
              company && company.createdAt ? format(new Date(company.createdAt), 'P') : 'N/A'
            }
          />
        </DataTable>
      )}
    </div>
  )
}
