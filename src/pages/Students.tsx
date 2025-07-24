import * as icon from '@coreui/icons'
import { CCol, CRow } from '@coreui/react'
import InfoStatWidget from '../components/InfoStatWidget'
import StudentTable from '../components/StudentTable';

const Students = () => {
  const widgets = [
    { icon: icon.cilPeople, value: '1,283', label: 'Total Students', tooltip: 'Amount of Students' },
    { icon: icon.cilBirthdayCake, value: '22', label: 'Average Age', tooltip: 'Mean age of students' },
    { icon: icon.cilLanguage, value: '37', label: 'Languages', tooltip: 'The number of different spoken languages' },
    { icon: icon.cilPushchair, value: '111', label: 'Parents', tooltip: 'Students who are parents' },
  ]

  return (
    <main role="main" aria-labelledby="students-heading">
      <div style={{ padding: '2rem' }}>
        <h1 id="students-heading" className="visually-hidden">Students Dashboard</h1>
        <section aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="visually-hidden">Student Statistics</h2>
          <CRow role="group" aria-label="Student statistics overview">
            {widgets.map((w, idx) => (
              <CCol xs={12} sm={6} md={3} className="mb-3" key={idx}>
                <InfoStatWidget {...w} />
              </CCol>
            ))}
          </CRow>
        </section>
        <section aria-labelledby="table-heading">
          <h2 id="table-heading" className="visually-hidden">Student Data Table</h2>
          <StudentTable />
        </section>
      </div>
    </main>
  )
}

export default Students
