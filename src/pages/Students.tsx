import * as icon from '@coreui/icons'
import { CCol, CRow } from '@coreui/react'
import InfoStatWidget from '../components/InfoStatWidget.tsx'
import StudentTable from '../components/StudentTable.tsx'
import API from '../API'
import { useState, useEffect } from 'react'

const Students = () => {
  const [totalStudents, setTotalStudents] = useState<string | number>('—')
  const [averageAge, setAverageAge] = useState<string | number>('—')
  const [languages, setLanguages] = useState<string | number>('—')
  const [parents, setParents] = useState<string | number>('—')

  useEffect(() => {

    //  const getTotalStudents = async () => {
    //  try {
    //   const res = await API.get('/students/count')
    //     if (res && res.data) {
    //       setTotalStudents(res.data.totalStudents)
    //     }
    //   } catch (err) {
    //     console.error('❌ Failed to fetch total students:', err)
    //   }
    // }

    const getAverageAge = async () => {
      try {
        console.log('API', API.defaults)
        const res = await API.get('/age/average')
        // console.log('✅ age/average response:', res);
        if (res && res.data) {
          setAverageAge(res.data.averageAge)
        }
      } catch (err) {
        console.error('❌ Failed to fetch average age:', err)
      }
    }

    // const getLanguages = async () => {
    //   try {
    //     const res = await API.get('/students/languages/count')
    //     if (res && res.data) {
    //       setLanguages(res.data.languageCount)
    //     }
    //   } catch (err) {
    //     console.error('❌ Failed to fetch languages:', err)
    //   }
    // }

    // const getParents = async () => {
    //   try {
    //     const res = await API.get('/students/parents/count')
    //     if (res && res.data) {
    //       setParents(res.data.parentCount)
    //     }
    //   } catch (err) {
    //     console.error('❌ Failed to fetch parents:', err)
    //   }
    //}

    //getTotalStudents()
    getAverageAge()
    //getLanguages()
    //getParents()
  }, [])

  const widgets = [
    { icon: icon.cilPeople, value: totalStudents, label: 'Total Students', tooltip: 'Amount of Students' },
    { icon: icon.cilBirthdayCake, value: averageAge, label: 'Average Age', tooltip: 'Mean age of all students' },
    { icon: icon.cilLanguage, value: languages, label: 'Languages', tooltip: 'The number of different spoken languages' },
    { icon: icon.cilPushchair, value: parents, label: 'Parents', tooltip: 'Students who are parents' },
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
