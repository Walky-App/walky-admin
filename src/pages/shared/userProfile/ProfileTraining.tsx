import { type Dispatch, type SetStateAction } from 'react'

import { Link } from 'react-router-dom'

import { Badge } from 'primereact/badge'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Card } from 'primereact/card'
import { Divider } from 'primereact/divider'

import { HtInputLabel } from '../../../components/shared/forms/HtInputLabel'
import { type IUser } from '../../../interfaces/User'
import { type ITrainingData } from '../../../interfaces/training'

export const ProfileTraining = ({
  userTraining,
  formUser,
  setFormUser,
  role,
  updateUser,
}: {
  userTraining: ITrainingData
  formUser: IUser
  setFormUser: Dispatch<SetStateAction<IUser>>
  role: string
  updateUser: React.FormEventHandler<HTMLFormElement>
}) => {
  if (userTraining.categories.length === 0)
    return (
      <h2>
        No Training data -
        <Link to="/learn" className="underline">
          Start Training today!
        </Link>
      </h2>
    )

  return (
    <div className="max-w-400 mt-3">
      {userTraining.categories.map(trainingData => {
        return (
          <div className="card max-h- max-w-xl" key={trainingData._id}>
            <div className="mb-12">
              <div className="sm:col-span-3">
                <HtInputLabel htmlFor="wps_training" asterisk labelText="WPS Training date" />
                <form onSubmit={updateUser}>
                  {role === 'employee' ? (
                    <h2> {formUser.wps_training?.toDateString()}</h2>
                  ) : (
                    <div className="card justify-content-center flex">
                      <Calendar
                        value={new Date(formUser.wps_training || new Date())}
                        onChange={e => setFormUser({ ...formUser, wps_training: e.value ?? undefined })}
                        disabled={role === 'employee'}
                      />
                      <Button type="submit" label="Update" disabled={role === 'employee'} />
                    </div>
                  )}
                </form>
              </div>
            </div>

            <Card
              title={trainingData.category.title}
              header={() => <img className="h-44 object-cover" alt="Card" src={trainingData.category.image} />}>
              {trainingData.is_completed ? (
                <div className="mb-4 flex justify-between">
                  <Badge value="Passed" size="normal" />
                  {trainingData.url_certificate ? (
                    <a href={trainingData.url_certificate}>
                      <i className="pi pi-check-circle" /> Certificate Link
                    </a>
                  ) : null}
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
                      <h2 className="text-3xl font-semibold">Modules</h2>
                      {module.units.map(unit => {
                        return (
                          <div key={unit.unit._id}>
                            <Divider />
                            <div className="flex items-center justify-between">
                              <h5 className="mt-3 text-xl font-semibold">{unit.unit.title}</h5>
                              <span>
                                {unit.assessments_completed ? 'Assessments Completed' : 'Assessments Not Completed'}
                              </span>
                            </div>

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
