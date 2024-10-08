import React, { useEffect, useState } from 'react'

import ReactMarkdown from 'react-markdown'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'

export const ChangelogAppPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [changelog, setChangelog] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChangelogApp = async () => {
      try {
        const response = await fetch('/CHANGELOG.md')
        if (!response.ok) {
          throw new Error(`Failed to fetch changelog: ${response.status} ${response.statusText}`)
        }
        const text = await response.text()
        if (text.trim() === '') {
          throw new Error('Changelog is empty')
        }
        setChangelog(text)
        setError(null)
      } catch (error) {
        console.error('Error fetching changelog:', error)
        setError(error instanceof Error ? error.message : 'An unknown error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchChangelogApp()
  }, [])

  if (isLoading) return <HTLoadingLogo />

  if (error) {
    return (
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-bold">App Changelog</h1>
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">App Changelog</h1>
      {changelog ? <ReactMarkdown>{changelog}</ReactMarkdown> : <p>No changelog data available.</p>}
    </div>
  )
}
