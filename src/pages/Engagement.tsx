import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilCompass, cilCalendar, cilLightbulb } from '@coreui/icons'
import { CTooltip } from '@coreui/react'
import { useTheme } from '../hooks/useTheme'
import { useTooltipStyle } from '../hooks/useTooltipStyle'




// Widget Component
const Widget = ({
  title,
  tooltip,
  value,
  progressValue,
  barColor,
  icon,
}: {
  title: string
  tooltip?: string
  value: string | number
  progressValue: number
  barColor: string
  icon: string | string[]
}) => {
  const { theme } = useTheme()
  useTooltipStyle(theme.isDark)


  const widgetContent = (
    <div
      style={{
        width: '160px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        padding: '1rem 1rem 1.25rem',
        height: '140px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <CIcon
        icon={icon}
        height={28}
        style={{
          color: '#444',
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
        }}
      />

      <div style={{ paddingTop: '1.5rem' }}>
        <strong style={{ fontSize: '1.2rem', color: '#000' }}>{value}</strong>
        <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>{title}</div>
      </div>

      <div
        style={{
          width: '100%',
          height: '6px',
          backgroundColor: '#e9ecef',
          borderRadius: '6px',
          marginTop: '0.75rem',
        }}
      >
        <div
          style={{
            width: `${progressValue}%`,
            height: '100%',
            backgroundColor: barColor,
            borderRadius: '6px',
          }}
        />
      </div>
    </div>
  );

  return tooltip ? (
    <CTooltip
      content={tooltip}
    >
      {widgetContent}
    </CTooltip>
  ) : (
    widgetContent
  )
  
};
// Section Component
const Section = ({
  title,
  color,
  children,
}: {
  title: string
  color: string
  children: React.ReactNode
}) => (
  <div
    style={{
      backgroundColor: color,
      padding: '1rem',
      borderRadius: '6px', 
      marginBottom: '2rem',
      width: 'fit-content', 
      maxWidth: '100%',        

    }}
  >
    <h5 style={{ color: 'white', marginBottom: '1rem' }}>{title}</h5>
    <div
  style={{
    display: 'flex',
    flexWrap: 'wrap',
    rowGap: '1rem',
    columnGap: '0.75rem',
    justifyContent: 'flex-start'
    
  }}
>
      {children}
    </div>
  </div>
)

// Main Page
const Engagement = () => {
  return (
    <div style={{ padding: '2rem' }}>

      <Section title="Walks" color="#6f42c1">
        <Widget title="Total Walks" tooltip="Number of total walks recorded" value="128" progressValue={90} barColor="#6f42c1" icon={cilCompass} />
        <Widget title="Pending" value="23" progressValue={50} barColor="#6f42c1" icon={cilCompass} />
        <Widget title="Active" value="6" progressValue={60} barColor="#6f42c1" icon={cilCompass} />
        <Widget title="Completed" value="98" progressValue={100} barColor="#6f42c1" icon={cilCompass} />
        <Widget title="Cancelled/Closed" value="14" progressValue={30} barColor="#6f42c1" icon={cilCompass} />
      </Section>

      <Section title="Events" color="#42a5f5">
        <Widget title="Total Events" tooltip="Number of total events created"  value="128" progressValue={90} barColor="#42a5f5" icon={cilCalendar} />
        <Widget title="Outdoor" value="23" progressValue={50} barColor="#42a5f5" icon={cilCalendar} />
        <Widget title="Indoor" value="6" progressValue={60} barColor="#42a5f5" icon={cilCalendar} />
        <Widget title="Public" value="98" progressValue={100} barColor="#42a5f5" icon={cilCalendar} />
        <Widget title="Private" value="14" progressValue={30} barColor="#42a5f5" icon={cilCalendar} />
      </Section>

      <Section title="Ideas" color="#f0ad4e">
        <Widget title="Total Ideas" tooltip="Number of total ideas created"  value="128" progressValue={90} barColor="#f0ad4e" icon={cilLightbulb} />
        <Widget title="Active" value="23" progressValue={50} barColor="#f0ad4e" icon={cilLightbulb} />
        <Widget title="Inactive" value="6" progressValue={60} barColor="#f0ad4e" icon={cilLightbulb} />
        <Widget title="Collaborated" value="98" progressValue={100} barColor="#f0ad4e" icon={cilLightbulb} />
      </Section>
    </div>
  )
}

export default Engagement
