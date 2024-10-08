import { type FieldErrors } from 'react-hook-form'

export function getFormErrorMessage(path: string, errors: FieldErrors) {
  const pathParts = path.split('.')
  let error: FieldErrors = errors

  for (const part of pathParts) {
    if (typeof error !== 'object' || error === null) {
      return null
    }
    error = error[part as keyof typeof error] as FieldErrors
  }

  if (error?.message) {
    return <p className="mt-2 text-sm text-red-600">{String(error.message)}</p>
  }

  return null
}

export const requiredFieldsNoticeText = (
  <p className="mt-1 text-sm leading-6 text-gray-600">
    <span style={{ color: 'red' }}>*</span> indicates a required field.
  </p>
)
