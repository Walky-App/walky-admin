export default function Continue({ continueStyle }) {
  return (
    <button
      type="submit"
      className={`rounded-md p-3 flex items-center space-x-2 ml-auto mr-5 ${
        continueStyle ? 'bg-zinc-950 text-zinc-50' : 'bg-zinc-200 text-zinc-400'
      }`}>
      <span>Continue</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
        />
      </svg>
    </button>
  )
}
