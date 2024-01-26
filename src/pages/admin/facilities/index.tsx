import React from 'react';
import GlobalTable from '../../../components/shared/GlobalTable'
import { RequestService } from '../../../services/RequestService'
import HeaderComponent from '../../../components/shared/general/HeaderComponent';

export default function AdminFacilities() {
  const [facilitiesData, setFacilitiesData] = React.useState<any>([])

  React.useEffect(() => {
    const getFacilities = async () => {
      const allFacilities = await RequestService('facilities')
      setFacilitiesData(allFacilities)
    }

    getFacilities()
  }, []) 

  const facilitiesColumns = [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Address', accessor: 'address' },
    { Header: 'Phone Number', accessor: 'phone_number' },
    { Header: 'City', accessor: 'city' },
    { Header: 'State', accessor: 'state' },
    { Header: 'Zip', accessor: 'zip' },
    { Header: 'Country', accessor: 'country' },
  ];

  return (
    <div className="flex flex-col gap-4">
        <HeaderComponent title={'Facilities'} />
        <GlobalTable data={facilitiesData} columns={facilitiesColumns} />
    </div>
  );
}

