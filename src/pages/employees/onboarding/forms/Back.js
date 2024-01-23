export default function Back({ prevStep }) {
  return (
    <button
      onClick={prevStep}
      className="text-zinc-950 rounded-md p-3 flex items-center space-x-2 ml-5">
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
          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
        />
      </svg>
      <span>Back</span>
    </button>
  )
}
