import Checkmark from '@/app/employee/onboarding/forms/Checkmark'

export default function Progress({ step }) {
  return (
    <div className="md:w-1/4 hidden md:block bg-zinc-950 p-4 h-screen">
      <img
        src="/assets/logos/Hemp-Temps-logo-horizontal-white.png"
        alt="Hemp-Temps"
        className="w-auto text-center mb-6"
      />
      <div className="flex flex-col space-y-4">
        <div className="flex items-center">
          {step > 1 ? (
            <Checkmark />
          ) : (
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                step === 1 ? 'bg-zinc-950 border-zinc-50 text-zinc-50' : 'bg-zinc-950 border-zinc-500 text-zinc-500'
              }`}>
              1
            </div>
          )}
          <span className={`ml-2 ${step === 1 ? 'text-zinc-50' : 'text-zinc-500'}`}>Business Information</span>
        </div>

        <div className="flex items-center">
          {step > 2 ? (
            <Checkmark />
          ) : (
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                step === 2 ? 'bg-zinc-950 border-zinc-50 text-zinc-50' : 'bg-zinc-950 border-zinc-500 text-zinc-500'
              }`}>
              2
            </div>
          )}
          <span className={`ml-2 ${step === 2 ? 'text-zinc-50' : 'text-zinc-500'}`}>Facility Information</span>
        </div>

        <div className="flex items-center">
          {step > 3 ? (
            <Checkmark />
          ) : (
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                step === 3 ? 'bg-zinc-950 border-zinc-50 text-zinc-50' : 'bg-zinc-950 border-zinc-500 text-zinc-500'
              }`}>
              2
            </div>
          )}
          <span className={`ml-2 ${step === 3 ? 'text-zinc-50' : 'text-zinc-500'}`}>Payment Information</span>
        </div>
      </div>
    </div>
  )
}
