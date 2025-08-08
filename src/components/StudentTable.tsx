import { useState, useEffect } from 'react'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import API from '../API/'

interface Student {
  id: string
  name: string
  email: string
  joined: string
  lastUpdate: string
}

const StudentTable = () => {
  const [students, setStudents] = useState<Student[]>([])
  const [flaggedUsers, setFlaggedUsers] = useState<string[]>([])

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await API.get<{
          users: {
            _id: string
            first_name: string
            last_name: string
            email: string
            createdAt: string
            updatedAt: string
          }[]
        }>('/users/?fields=_id,first_name,last_name,email,createdAt,updatedAt')
  
        const transformed = res.data.users.map((user) => ({
          id: user._id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          joined: user.createdAt,
          lastUpdate: user.updatedAt,
        }))
  
        setStudents(transformed)
      } catch (err) {
        console.error('❌ Failed to fetch student data:', err)
      }
    }
  
    fetchStudents()
  }, [])
  
  

  const handleToggleFlagUser = (id: string) => {
    setFlaggedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((userId) => userId !== id)
        : [...prev, id]
    )
  }

  return (
    <div
      style={{
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: '0',
        overflow: 'hidden',
      }}
    >
      <CTable hover responsive className="left-align">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">ID</CTableHeaderCell>
            <CTableHeaderCell scope="col">Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Email</CTableHeaderCell>
            <CTableHeaderCell scope="col">Joined</CTableHeaderCell>
            <CTableHeaderCell scope="col">Last Update</CTableHeaderCell>
            <CTableHeaderCell scope="col"></CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {students.map((student) => (
            <CTableRow
              data-testid="student-row"
              key={student.id}
              color={flaggedUsers.includes(student.id) ? 'danger' : undefined}
            >
              <CTableHeaderCell scope="row">{student.id}</CTableHeaderCell>
              <CTableDataCell>{student.name}</CTableDataCell>
              <CTableDataCell>{student.email}</CTableDataCell>
              <CTableDataCell>
                {new Date(student.joined).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </CTableDataCell>
              <CTableDataCell>
                {new Date(student.lastUpdate).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </CTableDataCell>
              <CTableDataCell>
                <CDropdown alignment="end">
                  <CDropdownToggle
                    data-testid={`dropdown-toggle-${student.id}`}
                    color="dark"
                    variant="ghost"
                    caret={false}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      boxShadow: 'none',
                      padding: 0,
                    }}
                  >
                    ⋮
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem data-testid={`send-email-${student.id}`}>Send email</CDropdownItem>
                    <CDropdownItem 
                      data-testid={`flag-user-${student.id}`}
                      onClick={() => handleToggleFlagUser(student.id)}>
                      {flaggedUsers.includes(student.id)
                        ? 'Unflag user'
                        : 'Flag user'}
                    </CDropdownItem>
                    <CDropdownItem data-testid={`request-edit-${student.id}`}>Request edit</CDropdownItem>
                    <CDropdownItem data-testid={`request-delete-${student.id}`}>Request to delete</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  )
}

export default StudentTable
