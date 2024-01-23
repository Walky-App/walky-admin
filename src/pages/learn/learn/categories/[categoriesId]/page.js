import Link from 'next/link'
import React from 'react'

export default function CategoryPage({ params }) {
  return <Link href={`/learn/modules/${params.categoriesId}`}>Module {params.categoriesId}</Link>
}
