import React from 'react'
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'


export const BreadcrumbDividersExample = () => {

    
  return (
    
    <CBreadcrumb style={{ '--cui-breadcrumb-divider': '"/"' } as React.CSSProperties}>
        <CBreadcrumb className="custom-breadcrumb"></CBreadcrumb>
      <CBreadcrumbItem href="#">Home</CBreadcrumbItem>
      <CBreadcrumbItem active>Dashboard</CBreadcrumbItem>
      
      
      
    </CBreadcrumb>
  )
}