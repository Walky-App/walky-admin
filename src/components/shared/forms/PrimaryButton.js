/**
 * Renders a primary button component.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.clickFunction - The function to be called when the button is clicked.
 * @param {string} props.text - The text to be displayed on the button.
 * @returns {JSX.Element} The rendered primary button component.
 */
export default function PrimaryButton({ clickFunction, text, type }) {
  const inputProps = type === 'submit' ? { type: 'submit' } : { onclick: clickFunction }
  return (
    <button
      {...inputProps}
      className="rounded-md p-3 flex items-center space-x-2 ml-auto mr-5 bg-zinc-950 text-zinc-50">
      <span>{text}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </button>
  )
}
