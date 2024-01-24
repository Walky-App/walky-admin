import React, { useState, useEffect } from 'react';
import GlobalTable from '../../../components/shared/GlobalTable'
import { RequestService } from '../../../services/RequestService'

export default function AdminUsers() {
  const [usersData, setUsersData] = React.useState<any>([])

  React.useEffect(() => {
    const getUsers = async () => {
      const allUsers = await RequestService('users')
      setUsersData(allUsers)
    }

    getUsers()
  }, []) 

  const usersColumns = [
    { Header: 'First Name', accessor: 'first_name' },
    { Header: 'Last Name', accessor: 'last_name' },
    { Header: 'Role', accessor: 'role'},
    { Header: 'Email', accessor: 'email' },
    { Header: 'Phone Number', accessor: 'phone_number' },
    { Header: 'City', accessor: 'city' },
    { Header: 'State', accessor: 'state' },
    { Header: 'Zip', accessor: 'zip' },
    { Header: 'Country', accessor: 'country' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <GlobalTable data={usersData} columns={usersColumns} />
    </div>
  );
}

