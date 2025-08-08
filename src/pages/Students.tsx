import * as icon from '@coreui/icons'
import { CCol, CRow } from '@coreui/react'
import InfoStatWidget from '../components/InfoStatWidget'
import StudentTable from '../components/StudentTable'
import API from '../API/'
import { useState, useEffect } from 'react'

const Students = () => {
  const [totalStudents, setTotalStudents] = useState<string | number>('—')
  const [averageAge, setAverageAge] = useState<string | number>('—')
  const [languages, setLanguages] = useState<string | number>('—')
  const [parents, setParents] = useState<string | number>('—')

  useEffect(() => {

     const getTotalStudents = async () => {
       try {
        const res = await API.get('/users/count')
          if (res && res.data) {
            setTotalStudents(res.data.totalUsersCreated)
          }
        } catch (err) {
          console.error('❌ Failed to fetch total students:', err)
        }
      }

    const getAverageAge = async () => {
      try {
        console.log('API', API.defaults)
        const res = await API.get('/age/average')
        if (res && res.data) {
          setAverageAge(Number(res.data.averageAge).toFixed())
        }
      } catch (err) {
        console.error('❌ Failed to fetch average age:', err)
      }
    }

    const getLanguages = async () => {
      try {
        const res = await API.get('/language/count')
        if (res?.data?.totalUniqueLanguages !== undefined) {
          setLanguages(res.data.totalUniqueLanguages)
        } else {
          setLanguages('—') // ⬅️ fallback!
        }
      } catch (err) {
        console.error('❌ Failed to fetch languages:', err)
        setLanguages('—') // ⬅️ fallback!
      }
    }

     const getParents = async () => {
       try {
         const res = await API.get('/users/parent-count')
         if (res && res.data) {
           setParents(res.data.parentUsersCount)
         }
       } catch (err) {
         console.error('❌ Failed to fetch parents:', err)
       }
    }

    getTotalStudents()
    getAverageAge()
    getLanguages()
    getParents()
  }, [])

  const widgets = [
    { icon: icon.cilPeople, value: totalStudents, label: 'Total Students', tooltip: 'Amount of Students', testId: 'total-students' },
    { icon: icon.cilBirthdayCake, value: averageAge, label: 'Average Age', tooltip: 'Mean age of all students', testId: 'average-age' },
    { icon: icon.cilLanguage, value: languages, label: 'Languages', tooltip: 'The number of different spoken languages', testId: 'languages' },
    { icon: icon.cilPushchair, value: parents, label: 'Parents', tooltip: 'Students who are parents', testId: 'parents' },
  ]

  return (
    <div style={{ padding: '2rem' }}>
      <CRow>
        {widgets.map((w, idx) => (
          <CCol xs={12} sm={6} md={3} className="mb-3" key={idx}>
            <InfoStatWidget {...w} />
          </CCol>
        ))}
      </CRow>
      <StudentTable />
    </div>
  )
}

export default Students
