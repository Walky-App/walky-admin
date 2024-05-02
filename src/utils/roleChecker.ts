import { GetTokenInfo } from './tokenUtil'

const admin_role = process.env.REACT_APP_ADMIN_ROLE as string
const client_role = process.env.REACT_APP_CLIENT_ROLE as string
const employee_role = process.env.REACT_APP_EMPLOYEE_ROLE as string
const sales_role = process.env.REACT_APP_SALES_ROLE as string

export const roleChecker = () => {
  const { role } = GetTokenInfo()

  let roleType = ''

  if (role === admin_role) {
    roleType = 'admin'
    return roleType
  } else if (role === client_role) {
    roleType = 'client'
    return roleType
  } else if (role === employee_role) {
    roleType = 'employee'
    return roleType
  } else if (role === sales_role) {
    roleType = 'sales'
    return roleType
  } else {
    roleType = 'unknown'
    return roleType
  }
}

export const roleTxt = (role: string) => {
  switch (role) {
    case admin_role:
      return 'Admin'
    case client_role:
      return 'Client'
    case sales_role:
      return 'Sales'
    case employee_role:
      return 'Employee'
    default:
      return 'Unknown'
  }
}
