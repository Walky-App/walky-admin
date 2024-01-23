import Link from 'next/link'
import React from 'react'

export default function UnitPage({ params }) {
  return <Link href={`/learn/modules/1/${params.unitId}`}>units {params.unitId}</Link>
}
