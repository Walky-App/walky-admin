import Checkmark from './Checkmark'

export default function ProgressBar({ currentStep, formValues, setFormValues, stepComplete }) {

  return (
    <div className="w-1/4 bg-zinc-950 p-4 h-screen">
      <img
        src="/assets/logos/Hemp-Temps-logo-horizontal-white.png"
        alt="Hemp-Temps"
        className="w-auto text-center mb-6"
      />
      <div className="flex flex-col space-y-4">
        <div className="flex items-center">
          {stepComplete.form1 === 'complete' ? (
            <Checkmark />
          ) : (
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                currentStep === 1
                  ? 'bg-zinc-950 border-zinc-50 text-zinc-50'
                  : 'bg-zinc-950 border-zinc-500 text-zinc-500'
              }`}>
              1
            </div>
          )}
          <span className={`ml-2 ${currentStep === 1 ? 'text-zinc-50' : 'text-zinc-500'}`}>
            Identification
          </span>
        </div>

        <div className="flex items-center">
          {stepComplete.form2 === 'complete' ? (
            <Checkmark />
          ) : (
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                currentStep === 2
                  ? 'bg-zinc-950 border-zinc-50 text-zinc-50'
                  : 'bg-zinc-950 border-zinc-500 text-zinc-500'
              }`}>
              2
            </div>
          )}
          <span className={`ml-2 ${currentStep === 2 ? 'text-zinc-50' : 'text-zinc-500'}`}>
            Direct Deposit
          </span>
        </div>

        <div className="flex items-center">
          {stepComplete.form3 === 'complete' ? (
            <Checkmark />
          ) : (
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                currentStep === 3
                  ? 'bg-zinc-950 border-zinc-50 text-zinc-50'
                  : 'bg-zinc-950 border-zinc-500 text-zinc-500'
              }`}>
              3
            </div>
          )}
          <span className={`ml-2 ${currentStep === 3 ? 'text-zinc-50' : 'text-zinc-500'}`}>
            W4
          </span>
        </div>

        <div className="flex items-center">
          {stepComplete.form4 === 'complete' ? (
            <Checkmark />
          ) : (
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                currentStep === 4
                  ? 'bg-zinc-950 border-zinc-50 text-zinc-50'
                  : 'bg-zinc-950 border-zinc-500 text-zinc-500'
              }`}>
              4
            </div>
          )}
          <span className={`ml-2 ${currentStep === 4 ? 'text-zinc-50' : 'text-zinc-500'}`}>
            State W4
          </span>
        </div>

        <div className="flex items-center">
          {stepComplete.form5 === 'complete' ? (
            <Checkmark />
          ) : (
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                currentStep === 5
                  ? 'bg-zinc-950 border-zinc-50 text-zinc-50'
                  : 'bg-zinc-950 border-zinc-500 text-zinc-500'
              }`}>
              5
            </div>
          )}
          <span className={`ml-2 ${currentStep === 5 ? 'text-zinc-50' : 'text-zinc-500'}`}>
            EEO
          </span>
        </div>

        <div className="flex items-center">
          {stepComplete.form6 === 'complete' ? (
            <Checkmark />
          ) : (
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                currentStep === 6
                  ? 'bg-zinc-950 border-zinc-50 text-zinc-50'
                  : 'bg-zinc-950 border-zinc-500 text-zinc-500'
              }`}>
              6
            </div>
          )}
          <span className={`ml-2 ${currentStep === 6 ? 'text-zinc-50' : 'text-zinc-500'}`}>
            Upload Document
          </span>
        </div>

        <div className="flex items-center">
          {stepComplete.form7 === 'complete' ? (
            <Checkmark />
          ) : (
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                currentStep === 7
                  ? 'bg-zinc-950 border-zinc-50 text-zinc-50'
                  : 'bg-zinc-950 border-zinc-500 text-zinc-500'
              }`}>
              7
            </div>
          )}
          <span className={`ml-2 ${currentStep === 7 ? 'text-zinc-50' : 'text-zinc-500'}`}>
            Policy Acknowledgment
          </span>
        </div>

        <div className="flex items-center">
          {stepComplete.form8 === 'complete' ? (
            <Checkmark />
          ) : (
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                currentStep === 8
                  ? 'bg-zinc-950 border-zinc-50 text-zinc-50'
                  : 'bg-zinc-950 border-zinc-500 text-zinc-500'
              }`}>
              8
            </div>
          )}
          <span className={`ml-2 ${currentStep === 8 ? 'text-zinc-50' : 'text-zinc-500'}`}>
            Handbook Acknowledgment
          </span>
        </div>

        <div className="flex items-center">
          {stepComplete.form9 === 'complete' ? (
            <Checkmark />
          ) : (
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                currentStep === 9
                  ? 'bg-zinc-950 border-zinc-50 text-zinc-50'
                  : 'bg-zinc-950 border-zinc-500 text-zinc-500'
              }`}>
              9
            </div>
          )}
          <span className={`ml-2 ${currentStep === 9 ? 'text-zinc-50' : 'text-zinc-500'}`}>
            Emergency Contact Information
          </span>
        </div>

        <div className="flex items-center">
          {stepComplete.form10 === 'complete' ? (
            <Checkmark />
          ) : (
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                currentStep === 10
                  ? 'bg-zinc-950 border-zinc-50 text-zinc-50'
                  : 'bg-zinc-950 border-zinc-500 text-zinc-500'
              }`}>
              10
            </div>
          )}
          <span className={`ml-2 ${currentStep === 10 ? 'text-zinc-50' : 'text-zinc-500'}`}>
            Federal Form I-9
          </span>
        </div>
        <div className="flex items-center">
          {stepComplete.form11 === 'complete' ? (
            <Checkmark />
          ) : (
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                currentStep === 11
                  ? 'bg-zinc-950 border-zinc-50 text-zinc-50'
                  : 'bg-zinc-950 border-zinc-500 text-zinc-500'
              }`}>
              11
            </div>
          )}
          <span className={`ml-2 ${currentStep === 11 ? 'text-zinc-50' : 'text-zinc-500'}`}>
            Final Message
          </span>
        </div>
      </div>
    </div>
  )
}
