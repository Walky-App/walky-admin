import { GetTokenInfo } from './tokenUtil'

const admin_role = process.env.REACT_APP_ADMIN_ROLE as string
const client_role = process.env.REACT_APP_CLIENT_ROLE as string
const employee_role = process.env.REACT_APP_EMPLOYEE_ROLE as string
const sales_role = process.env.REACT_APP_SALES_ROLE as string

export const getCurrentUserRole = () => {
  const token_info = GetTokenInfo()

  switch (token_info.role) {
    case admin_role:
      return 'admin'
    case client_role:
      return 'client'
    case employee_role:
      return 'employee'
    case sales_role:
      return 'sales'
    default:
      return 'guest'
  }
}
