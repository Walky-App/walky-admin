import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilCompass, cilCalendar, cilLightbulb } from '@coreui/icons'

// Widget Component
const Widget = ({
  title,
  value,
  progressValue,
  barColor,
  icon,
}: {
  title: string
  value: string | number
  progressValue: number
  barColor: string
  icon: string | string[]
}) => (
  <div
    style={{
      width: '160px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px', // subtle rounding for card
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
      height={28} // larger icon
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
        borderRadius: '6px', // rounded track
        marginTop: '0.75rem', // space between label and bar
      }}
    >
      <div
        style={{
          width: `${progressValue}%`,
          height: '100%',
          backgroundColor: barColor,
          borderRadius: '6px', // rounded fill
        }}
      />
    </div>
  </div>
)


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
      borderRadius: '0px', // 🔷 No rounding on section containers
      marginBottom: '2rem',
    }}
  >
    <h5 style={{ color: 'white', marginBottom: '1rem' }}>{title}</h5>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        gap: '0.75rem',
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

      <Section title="Realtime" color="#6f42c1">
        <Widget title="Total Walks" value="128" progressValue={90} barColor="#6f42c1" icon={cilCompass} />
        <Widget title="Pending" value="23" progressValue={50} barColor="#6f42c1" icon={cilCompass} />
        <Widget title="Active" value="6" progressValue={60} barColor="#6f42c1" icon={cilCompass} />
        <Widget title="Completed" value="98" progressValue={100} barColor="#6f42c1" icon={cilCompass} />
        <Widget title="Cancelled/Closed" value="14" progressValue={30} barColor="#6f42c1" icon={cilCompass} />
      </Section>

      <Section title="Events" color="#42a5f5">
        <Widget title="Total Events" value="128" progressValue={90} barColor="#42a5f5" icon={cilCalendar} />
        <Widget title="Outdoor" value="23" progressValue={50} barColor="#42a5f5" icon={cilCalendar} />
        <Widget title="Indoor" value="6" progressValue={60} barColor="#42a5f5" icon={cilCalendar} />
        <Widget title="Public" value="98" progressValue={100} barColor="#42a5f5" icon={cilCalendar} />
        <Widget title="Private" value="14" progressValue={30} barColor="#42a5f5" icon={cilCalendar} />
      </Section>

      <Section title="Ideas" color="#f0ad4e">
        <Widget title="Total Ideas" value="128" progressValue={90} barColor="#f0ad4e" icon={cilLightbulb} />
        <Widget title="Active" value="23" progressValue={50} barColor="#f0ad4e" icon={cilLightbulb} />
        <Widget title="Inactive" value="6" progressValue={60} barColor="#f0ad4e" icon={cilLightbulb} />
        <Widget title="Collaborated" value="98" progressValue={100} barColor="#f0ad4e" icon={cilLightbulb} />
        <Widget title="Private" value="14" progressValue={30} barColor="#f0ad4e" icon={cilLightbulb} />
      </Section>
    </div>
  )
}

export default Engagement
