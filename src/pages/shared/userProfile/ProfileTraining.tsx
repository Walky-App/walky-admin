import { Link } from 'react-router-dom'

import { Badge } from 'primereact/badge'
import { Card } from 'primereact/card'
import { Divider } from 'primereact/divider'

import { type ITrainingData } from '../../../interfaces/training'

export const ProfileTraining = ({ userTraining }: { userTraining: ITrainingData }) => {
  if (userTraining.categories.length === 0)
    return (
      <h2>
        No Training data -
        <Link to="/learn" className="underline">
          {' '}
          Start Training today!
        </Link>
      </h2>
    )

  return (
    <div className="max-w-400 mt-3">
      {userTraining.categories.map(trainingData => {
        return (
          <div className="card max-h- max-w-xl" key={trainingData._id}>
            <Card
              title={trainingData.category.title}
              header={() => <img className="h-44 object-cover" alt="Card" src={trainingData.category.image} />}>
              {trainingData.is_completed ? (
                <div className="mb-4 flex justify-between">
                  <Badge value="Passed" size="normal" />

                  <a href={trainingData.url_certificate}>
                    <i className="pi pi-check-circle" /> Certificate Link
                  </a>
                </div>
              ) : null}

              <Divider />
              {trainingData.modules.map(module => {
                return (
                  <div key={module.module._id}>
                    <h4>
                      <strong> Course:</strong> {module.module.title}
                    </h4>
                    <p>
                      <strong> Status:</strong> {module.is_completed ? 'Completed' : 'Not Completed'}
                    </p>
                    <p>
                      <Divider />
                      <strong>Units</strong>
                      {module.units.map(unit => {
                        return (
                          <div key={unit.unit._id}>
                            <h5> {unit.unit.title}</h5>
                            <p>{unit.assessments_completed ? 'Assessments Completed' : 'Assessments Not Completed'}</p>
                            <p>
                              <strong>Assessment Results:</strong>
                              {unit.assessment_results_records.map((assessment, index) => {
                                return (
                                  <div key={assessment._id}>
                                    <p>
                                      Try {index + 1} - {assessment.percentagea_assessment}% -{' '}
                                      {assessment.pass_assessment ? '✅ Passed' : '😞 Not Passed'}
                                    </p>
                                  </div>
                                )
                              })}
                            </p>
                          </div>
                        )
                      })}
                    </p>
                  </div>
                )
              })}
            </Card>
          </div>
        )
      })}
    </div>
  )
}
