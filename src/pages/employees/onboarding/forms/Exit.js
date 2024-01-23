import { useRouter } from 'next/navigation'

export default function Exit() {
  const router = useRouter()
  const handleExit = () => {
    alert('This funtionallity needs to be built out')

    router.push('/dashboard')
    //Send data to API for tracking progress / possibly set local storage with non-sensitive info as well
    //States of Progress bar need to get updated somehow when user returns to onboarding form
    //Fields of form should also be repopulated
    //In Figma, when user actually needs to submit data they have a Logout button.  Leaving as Exit button for now
  }

  return (
    <div className=" flex items-center absolute z-10 top-0 w-3/4 py-4 bg-zinc-50 shadow-md">
      <button className="ml-auto mr-5" onClick={handleExit}>
        Exit
      </button>
    </div>
  )
}
