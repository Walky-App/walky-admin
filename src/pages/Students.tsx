import * as icon from '@coreui/icons'
import { CCol, CRow } from '@coreui/react'
import InfoStatWidget from '../components/InfoStatWidget' 




const Students = () => {
  const widgets = [
    { icon: icon.cilPeople, value: '1,283', label: 'Total Students', tooltip: 'Amount of Students' },
    { icon: icon.cilBirthdayCake, value: '22', label: 'Average Age', tooltip: 'Mean age of students' },
    { icon: icon.cilLanguage, value: '37', label: 'Languages', tooltip: 'The number of different spoken languages' },
    { icon: icon.cilPushchair, value: '111', label: 'Parents', tooltip: 'Students who are parents' },
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
    </div>
  )
}

export default Students
