import type { FieldErrors } from 'react-hook-form'

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
    return error.message ? <p className="mt-2 text-sm text-red-600">{String(error.message)}</p> : null
  }

  return null
}
