import React, { useEffect, useState } from 'react'

import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { requestService } from '../../../services/requestServiceNew'

interface Commit {
  date: string
  message: string
  hash: string
}

export const ChangelogApiPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [changelog, setChangelog] = useState<Commit[]>([])

  useEffect(() => {
    setIsLoading(true)
    const fetchChangelog = async () => {
      try {
        const response = await requestService({ path: 'changelog/api' })
        if (!response.ok) throw new Error('Failed to fetch changelog')
        const commits: Commit[] = await response.json()
        setChangelog(commits)
      } catch (error) {
        console.error('Error fetching changelog', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChangelog()
  }, [])

  if (isLoading) return <HTLoadingLogo />

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">API Changelog</h1>
      <ul className="space-y-2">
        {changelog.map(commit => (
          <li key={commit.hash} className="rounded border p-2">
            <p className="font-semibold">{commit.date}</p>
            <p>{commit.message}</p>
            <p className="text-sm text-gray-500">Commit: {commit.hash.substring(0, 7)}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
