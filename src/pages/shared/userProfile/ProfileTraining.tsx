import { type Dispatch, type SetStateAction } from 'react'

import { Badge } from 'primereact/badge'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Card } from 'primereact/card'
import { Divider } from 'primereact/divider'

import { HtInputLabel } from '../../../components/shared/forms/HtInputLabel'
import { type IUserPopulated } from '../../../interfaces/User'
import { type ITrainingData } from '../../../interfaces/training'

export const ProfileTraining = ({
  userTraining,
  formUser,
  setFormUser,
  role,
  updateUser,
}: {
  userTraining: ITrainingData
  formUser: IUserPopulated
  setFormUser: Dispatch<SetStateAction<IUserPopulated>>
  role: string
  updateUser: () => void
}) => {
  return (
    <>
      <div className="mb-12">
        <div className="sm:col-span-3">
          <HtInputLabel htmlFor="wps_training" asterisk labelText="WPS Training date" />
          {role === 'employee' ? (
            <h2>
              {formUser.wps_training ? new Date(formUser.wps_training).toDateString() : 'No training date available'}
            </h2>
          ) : (
            <div className="card justify-content-center flex">
              <Calendar
                value={formUser.wps_training ? new Date(formUser.wps_training) : null}
                onChange={e => setFormUser({ ...formUser, wps_training: e.value ?? undefined })}
                disabled={role === 'employee'}
              />
              <Button type="button" label="Update" onClick={updateUser} disabled={role === 'employee'} />
            </div>
          )}
        </div>
      </div>

      {userTraining.categories.length !== 0 ? (
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
      ) : null}

      <div className="mx-auto max-w-7xl  sm:px-6 sm:py-12 lg:px-8">
        <div className="relative isolate mb-12 overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <svg
            viewBox="0 0 1024 1024"
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0">
            <circle r={512} cx={512} cy={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
            <defs>
              <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                <stop stopColor="#ffffff" />
                <stop offset={1} stopColor="#057a55" />
              </radialGradient>
            </defs>
          </svg>
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Start Your Training
              <br />
              and Get certified Today!
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              You will not be able to start picking up shifts until you've completed your onboarding and training.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <a
                href="/learn"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                Get started
              </a>
              <a href="/learn" className="text-sm font-semibold leading-6 text-white">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div className="relative mt-16 h-80 lg:mt-8">
            <img
              alt="App screenshot"
              src="/assets/htu-screenshot.png"
              width={1824}
              height={1080}
              className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
            />
          </div>
        </div>

        <div className="relative isolate my-12 overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <svg
            viewBox="0 0 1024 1024"
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0">
            <circle r={512} cx={512} cy={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
            <defs>
              <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                <stop stopColor="#ffffff" />
                <stop offset={1} stopColor="#057a55" />
              </radialGradient>
            </defs>
          </svg>
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Free WPS training
              <br />
              and get certified Today!
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              You will not be able to start picking up shifts until you've completed your onboarding and training.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <a
                href="https://calendly.com/shannon-3rvz/wps-free-training?month=2024-06"
                target="_blank"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                Get started
              </a>
              <a
                href="https://calendly.com/shannon-3rvz/wps-free-training?month=2024-06"
                target="_blank"
                className="text-sm font-semibold leading-6 text-white">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div className="relative mt-16 h-80 lg:mt-8">
            <img
              alt="App screenshot"
              src="https://greencultured.co/wp-content/uploads/2100/01/Environmental-Protection-Agency-EPA-Worker-Protection-Standard-Training-600x384.jpg"
              width={1824}
              height={1080}
              className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
            />
          </div>
        </div>
      </div>
    </>
  )
}
