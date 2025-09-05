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
  CBadge,
} from '@coreui/react'
import API from '../API/'
import { useTheme } from '../hooks/useTheme'

interface Student {
  id: string
  name: string
  email: string
  joined: string
  lastUpdate: string
}

const StudentTable = () => {
  const { theme } = useTheme()
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
        border: "none",
        borderRadius: '16px',
        padding: '0',
        overflow: 'hidden',
        background: theme.colors.cardBg,
        boxShadow: theme.isDark 
          ? "0 4px 20px rgba(0,0,0,0.2)" 
          : "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      <CTable hover responsive className="left-align mb-0">
        <CTableHead>
          <CTableRow 
            style={{
              background: theme.isDark 
                ? `linear-gradient(135deg, ${theme.colors.primary}15, ${theme.colors.info}10)`
                : `linear-gradient(135deg, ${theme.colors.primary}08, ${theme.colors.info}05)`,
            }}
          >
            <CTableHeaderCell 
              scope="col"
              style={{
                fontWeight: "600",
                fontSize: "14px",
                color: theme.colors.bodyColor,
                border: "none",
                padding: "16px 20px",
              }}
            >
              Student ID
            </CTableHeaderCell>
            <CTableHeaderCell 
              scope="col"
              style={{
                fontWeight: "600",
                fontSize: "14px",
                color: theme.colors.bodyColor,
                border: "none",
                padding: "16px 20px",
              }}
            >
              Full Name
            </CTableHeaderCell>
            <CTableHeaderCell 
              scope="col"
              style={{
                fontWeight: "600",
                fontSize: "14px",
                color: theme.colors.bodyColor,
                border: "none",
                padding: "16px 20px",
              }}
            >
              Email Address
            </CTableHeaderCell>
            <CTableHeaderCell 
              scope="col"
              style={{
                fontWeight: "600",
                fontSize: "14px",
                color: theme.colors.bodyColor,
                border: "none",
                padding: "16px 20px",
              }}
            >
              Join Date
            </CTableHeaderCell>
            <CTableHeaderCell 
              scope="col"
              style={{
                fontWeight: "600",
                fontSize: "14px",
                color: theme.colors.bodyColor,
                border: "none",
                padding: "16px 20px",
              }}
            >
              Last Activity
            </CTableHeaderCell>
            <CTableHeaderCell 
              scope="col"
              style={{
                fontWeight: "600",
                fontSize: "14px",
                color: theme.colors.bodyColor,
                border: "none",
                padding: "16px 20px",
                textAlign: "center",
              }}
            >
              Actions
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {students.map((student) => (
            <CTableRow
              key={student.id}
              style={{
                backgroundColor: flaggedUsers.includes(student.id) 
                  ? `${theme.colors.danger}15` 
                  : 'transparent',
                borderBottom: `1px solid ${theme.colors.borderColor}30`,
                transition: "all 0.2s ease",
              }}
              className="custom-table-hover"
            >
              <CTableHeaderCell 
                scope="row"
                style={{
                  fontWeight: "500",
                  fontSize: "13px",
                  color: theme.colors.textMuted,
                  border: "none",
                  padding: "16px 20px",
                }}
              >
                #{student.id.slice(-6)}
              </CTableHeaderCell>
              <CTableDataCell
                style={{
                  fontWeight: "600",
                  fontSize: "14px",
                  color: theme.colors.bodyColor,
                  border: "none",
                  padding: "16px 20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.info})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  {student.name}
                </div>
              </CTableDataCell>
              <CTableDataCell
                style={{
                  fontSize: "14px",
                  color: theme.colors.textMuted,
                  border: "none",
                  padding: "16px 20px",
                }}
              >
                {student.email}
              </CTableDataCell>
              <CTableDataCell
                style={{
                  fontSize: "14px",
                  color: theme.colors.bodyColor,
                  border: "none",
                  padding: "16px 20px",
                }}
              >
                <CBadge 
                  color="success"
                  style={{
                    backgroundColor: `${theme.colors.success}20`,
                    color: theme.colors.success,
                    border: `1px solid ${theme.colors.success}40`,
                    fontSize: "12px",
                    fontWeight: "500",
                    padding: "4px 8px",
                  }}
                >
                  {new Date(student.joined).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </CBadge>
              </CTableDataCell>
              <CTableDataCell
                style={{
                  fontSize: "14px",
                  color: theme.colors.bodyColor,
                  border: "none",
                  padding: "16px 20px",
                }}
              >
                <CBadge 
                  color="info"
                  style={{
                    backgroundColor: `${theme.colors.info}20`,
                    color: theme.colors.info,
                    border: `1px solid ${theme.colors.info}40`,
                    fontSize: "12px",
                    fontWeight: "500",
                    padding: "4px 8px",
                  }}
                >
                  {new Date(student.lastUpdate).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </CBadge>
              </CTableDataCell>
              <CTableDataCell
                style={{
                  border: "none",
                  padding: "16px 20px",
                  textAlign: "center",
                }}
              >
                <CDropdown alignment="end">
                  <CDropdownToggle
                    color="secondary"
                    variant="ghost"
                    caret={false}
                    style={{
                      backgroundColor: `${theme.colors.primary}10`,
                      border: `1px solid ${theme.colors.primary}20`,
                      borderRadius: "8px",
                      padding: "8px 12px",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: theme.colors.primary,
                      transition: "all 0.2s ease",
                    }}
                  >
                    ⋯
                  </CDropdownToggle>
                  <CDropdownMenu
                    style={{
                      borderRadius: "12px",
                      border: `1px solid ${theme.colors.borderColor}`,
                      boxShadow: theme.isDark 
                        ? "0 8px 32px rgba(0,0,0,0.4)" 
                        : "0 8px 32px rgba(0,0,0,0.15)",
                      backgroundColor: theme.colors.cardBg,
                    }}
                  >
                    <CDropdownItem
                      style={{
                        color: theme.colors.bodyColor,
                        fontSize: "14px",
                        fontWeight: "500",
                        padding: "8px 16px",
                      }}
                    >
                      📧 Send Email
                    </CDropdownItem>
                    <CDropdownItem 
                      onClick={() => handleToggleFlagUser(student.id)}
                      style={{
                        color: flaggedUsers.includes(student.id) ? theme.colors.success : theme.colors.warning,
                        fontSize: "14px",
                        fontWeight: "500",
                        padding: "8px 16px",
                      }}
                    >
                      {flaggedUsers.includes(student.id)
                        ? '✅ Unflag User'
                        : '⚠️ Flag User'}
                    </CDropdownItem>
                    <CDropdownItem
                      style={{
                        color: theme.colors.bodyColor,
                        fontSize: "14px",
                        fontWeight: "500",
                        padding: "8px 16px",
                      }}
                    >
                      ✏️ Request Edit
                    </CDropdownItem>
                    <CDropdownItem
                      style={{
                        color: theme.colors.danger,
                        fontSize: "14px",
                        fontWeight: "500",
                        padding: "8px 16px",
                      }}
                    >
                      🗑️ Request Delete
                    </CDropdownItem>
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
