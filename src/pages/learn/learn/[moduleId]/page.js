import Link from 'next/link'
import React from 'react'

export default function ModulePage({ params }) {
  return <Link href={`/learn/modules/${params.moduleId}`}>Module {params.moduleId}</Link>
}
