import { NavigationButton } from './NavigationButton'

interface EmptyStateProps {
  type: 'category' | 'module' | 'unit' | 'assessment' | 'job' | 'facility' | 'user'
  to: string
}

export const EmptyState = ({ type, to }: EmptyStateProps) => {
  const textWithFirstLetterCapitalized = type ? type.charAt(0).toUpperCase() + type.slice(1) : ''

  return (
    <div className="text-center">
      <svg
        aria-hidden="true"
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No {type}</h3>
      <p className="mt-1 text-sm text-gray-500">Get started by creating a new {type}.</p>
      <div className="mt-6">
        <NavigationButton text={`New ${textWithFirstLetterCapitalized}`} to={to} />
      </div>
    </div>
  )
}
