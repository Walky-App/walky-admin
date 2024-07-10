import { Card } from 'primereact/card'

interface DashboardHeaderProps {
  children?: React.ReactNode
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ children }) => {
  return <Card> {children}</Card>
}
