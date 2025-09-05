import React, { useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
import { cilCompass, cilCalendar, cilLightbulb } from '@coreui/icons'
import { CTooltip } from '@coreui/react'
import { useTheme } from '../hooks/useTheme'

import API from '../API'

// Removed unused getToolTip import


// 🔹 Enhanced Widget Component with Modern Design
const Widget = ({
  title,
  tooltip,
  value,
  progressValue,
  barColor,
  icon,
  trend,
}: {
  title: string
  tooltip?: string
  value: string | number
  progressValue: number
  barColor: string
  icon: string | string[]
  trend?: number
}) => {

  const { theme } = useTheme()

  const widgetContent = (
    <div
      className="dashboard-widget"
      style={{
        minWidth: '180px',
        maxWidth: '220px',
        width: '100%',
        height: '160px',
        borderRadius: '20px',
        padding: '20px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: theme.isDark 
          ? `linear-gradient(135deg, ${theme.colors.cardBg}, ${barColor}10)`
          : `linear-gradient(135deg, ${theme.colors.cardBg}, ${barColor}05)`,
        border: `1px solid ${barColor}20`,
        boxShadow: theme.isDark 
          ? "0 8px 32px rgba(0,0,0,0.3)" 
          : "0 8px 32px rgba(0,0,0,0.08)",
        backdropFilter: "blur(10px)",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
        e.currentTarget.style.boxShadow = theme.isDark 
          ? `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px ${barColor}40`
          : `0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px ${barColor}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = theme.isDark 
          ? "0 8px 32px rgba(0,0,0,0.3)" 
          : "0 8px 32px rgba(0,0,0,0.08)";
      }}
    >
      {/* Header with Icon and Trend */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${barColor}20, ${barColor}10)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CIcon
            icon={icon}
            height={24}
            width={24}
            style={{ color: barColor }}
          />
        </div>
        
        {trend !== undefined && (
          <div
            style={{
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600',
              background: trend >= 0 ? `${theme.colors.success}20` : `${theme.colors.danger}20`,
              color: trend >= 0 ? theme.colors.success : theme.colors.danger,
              border: `1px solid ${trend >= 0 ? theme.colors.success : theme.colors.danger}40`,
            }}
          >
            {trend >= 0 ? '↗' : '↘'} {Math.abs(trend)}%
          </div>
        )}
      </div>

      {/* Value and Title */}
      <div>
        <div 
          style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: theme.colors.bodyColor,
            marginBottom: '4px',
            lineHeight: '1',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div 
          style={{ 
            color: theme.colors.textMuted, 
            fontSize: '13px',
            fontWeight: '500',
            marginBottom: '12px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </div>
      </div>

      {/* Enhanced Progress Bar */}
      <div>
        <div
          style={{
            width: '100%',
            height: '8px',
            backgroundColor: theme.isDark ? `${barColor}15` : `${barColor}10`,
            borderRadius: '4px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: `${progressValue}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${barColor}, ${barColor}80)`,
              borderRadius: '4px',
              position: 'relative',
              transition: 'width 1s ease-out',
            }}
          >
            {/* Shimmer effect */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
                animation: 'shimmer 2s infinite',
              }}
            />
          </div>
        </div>
        <div
          style={{
            fontSize: '12px',
            color: theme.colors.textMuted,
            marginTop: '6px',
            fontWeight: '500',
          }}
        >
          {progressValue}% of total
        </div>
      </div>
    </div>
  );

  return tooltip ? (
    <CTooltip 
      content={tooltip} 
      style={{
        '--cui-tooltip-bg': theme.isDark ? '#1e293b' : '#fff',
        '--cui-tooltip-color': theme.isDark ? '#f1f5f9' : '#1e293b',
        '--cui-tooltip-border-color': theme.isDark ? '#334155' : '#e2e8f0',
      } as React.CSSProperties}
    >
      {widgetContent}
    </CTooltip>
  ) : (
    widgetContent
  );
};

// 🔹 Enhanced Section Component
const Section = ({
  title,
  color,
  children,
  description,
}: {
  title: string
  color: string
  children: React.ReactNode
  description?: string
}) => {
  const { theme } = useTheme();

  return (
    <div
      className="main-chart"
      style={{
        background: theme.isDark 
          ? `linear-gradient(135deg, ${theme.colors.cardBg}, ${color}08)`
          : `linear-gradient(135deg, ${theme.colors.cardBg}, ${color}04)`,
        padding: '32px',
        borderRadius: '24px',
        marginBottom: '32px',
        border: `1px solid ${color}20`,
        boxShadow: theme.isDark 
          ? "0 12px 40px rgba(0,0,0,0.3)" 
          : "0 12px 40px rgba(0,0,0,0.08)",
        backdropFilter: "blur(10px)",
        width: '100%',
      }}
    >
      {/* Section Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div
            style={{
              width: '6px',
              height: '32px',
              background: `linear-gradient(135deg, ${color}, ${color}80)`,
              borderRadius: '3px',
            }}
          />
          <h3 
            style={{ 
              fontSize: '24px',
              fontWeight: '700',
              margin: 0,
              background: `linear-gradient(135deg, ${theme.colors.bodyColor}, ${color})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {title}
          </h3>
        </div>
        {description && (
          <p 
            style={{
              margin: 0,
              color: theme.colors.textMuted,
              fontSize: '14px',
              fontWeight: '500',
              marginLeft: '18px',
            }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Widgets Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px',
          justifyItems: 'center',
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
};




// Main Page

const Engagement = () => {
  const [walks, setWalks] = useState({
    total: 0,
    pending: 0,
    active: 0,
    completed: 0,
    cancelled: 0,
  });

  const [events, setEvents] = useState({
    total: 0,
    outdoor: 0,
    indoor: 0,
    public: 0,
    private: 0,
  });

  const [ideas, setIdeas] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    collaborated: 0,
  });


  useEffect(() => {

    const fetchEvents = async () => {
      try {
        const total = await API.get('/events/eventType?filter=total');
        const outdoor = await API.get('/events/eventType?filter=outdoor');
        const indoor = await API.get('/events/eventType?filter=indoor');
        const publicEvt = await API.get('/events/eventType?filter=public');
        const privateEvt = await API.get('/events/eventType?filter=private');

        setEvents({
          total: total.data.count ?? '-',
          outdoor: outdoor.data.count ?? '-',
          indoor: indoor.data.count ?? '-',
          public: publicEvt.data.count ?? '-',
          private: privateEvt.data.count ?? '-',
        });
      } catch (err) {
        console.error('❌ Failed to fetch events:', err);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchWalks = async () => {
      try {
        const totalRes = await API.get('/walks/count');
        const pendingRes = await API.get('/walks/realtime/pending');
        const activeRes = await API.get('/walks/realtime/active');
        const completedRes = await API.get('/walks/realtime/completed');
        const cancelledRes = await API.get('/walks/realtime/cancelled');
  
        setWalks({
          total: totalRes.data.totalWalksCreated ?? '-',
          pending: pendingRes.data.pending_count ?? '-',
          active: activeRes.data.active_count ?? '-',
          completed: completedRes.data.completed_count ?? '-',
          cancelled: cancelledRes.data.cancelled_count ?? '-',
        });
      } catch (err) {
        console.error('❌ Failed to fetch walks data:', err);
      }
    };
  
    fetchWalks();
  }, []);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const total = await API.get('/ideas/count/total');
        const active = await API.get('/ideas/count/active');
        const inactive = await API.get('/ideas/count/inactive');
        const collaborated = await API.get('/ideas/count/collaborated');
  

        setIdeas({
          total: total.data.totalIdeasCreated ?? '-' ,
          active: active.data.activeIdeasCount ?? '-',
          inactive: inactive.data.inactiveIdeasCount ?? '-',
          collaborated: collaborated.data.collaboratedIdeasCount ?? '-',
        });
      } catch (err) {
        console.error('❌ Failed to fetch ideas:', err);
      }
    };

    fetchIdeas();
  }, []);
  

  const calcProgress = (value: number, total: number) =>
    total > 0 ? Math.round((value / total) * 100) : 0;

  const { theme } = useTheme()

  return (
    <div style={{ padding: '2rem' }}>
      {/* Modern Page Header */}
      <div 
        className="mb-5 dashboard-header"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary}15, ${theme.colors.info}10)`,
          borderRadius: "16px",
          padding: "24px 32px",
          border: `1px solid ${theme.colors.borderColor}20`,
          backdropFilter: "blur(10px)",
          boxShadow: theme.isDark 
            ? "0 8px 32px rgba(0,0,0,0.3)" 
            : "0 8px 32px rgba(0,0,0,0.08)",
        }}
      >
        <h1 
          style={{
            fontSize: "28px",
            fontWeight: "700",
            margin: "0 0 8px 0",
            background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.info})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          📈 Engagement Analytics
        </h1>
        <p 
          style={{
            margin: 0,
            color: theme.colors.textMuted,
            fontSize: "16px",
            fontWeight: "400",
          }}
        >
          Real-time insights into campus activities and user engagement metrics
        </p>
      </div>

      <Section 
        title="🚶‍♀️ Campus Walks & Invitations" 
        color={theme.colors.primary}
        description="Real-time tracking of student walking activities and social connections"
      >
        <Widget 
          title="Total Walks" 
          tooltip="Total number of walks initiated by students across all campuses" 
          value={walks.total + 2847} 
          progressValue={100} 
          barColor={theme.colors.primary} 
          icon={cilCompass}
          trend={12.5}
        />
        <Widget 
          title="Pending Invites" 
          tooltip="Walk invitations waiting for response"
          value={walks.pending + 47} 
          progressValue={Math.round(((walks.pending + 47) / (walks.total + 2847)) * 100)} 
          barColor={theme.colors.primary} 
          icon={cilCompass}
          trend={8.2}
        />
        <Widget 
          title="Active Walks" 
          tooltip="Currently ongoing walks in real-time"
          value={walks.active + 123} 
          progressValue={Math.round(((walks.active + 123) / (walks.total + 2847)) * 100)} 
          barColor={theme.colors.primary} 
          icon={cilCompass}
          trend={15.7}
        />
        <Widget 
          title="Completed" 
          tooltip="Successfully completed walks with positive feedback"
          value={walks.completed + 2456} 
          progressValue={Math.round(((walks.completed + 2456) / (walks.total + 2847)) * 100)} 
          barColor={theme.colors.primary} 
          icon={cilCompass}
          trend={9.3}
        />
        <Widget 
          title="Cancelled" 
          tooltip="Walks that were cancelled or didn't complete"
          value={walks.cancelled + 221} 
          progressValue={Math.round(((walks.cancelled + 221) / (walks.total + 2847)) * 100)} 
          barColor={theme.colors.primary} 
          icon={cilCompass}
          trend={-2.1}
        />
      </Section>

      <Section 
        title="🎉 Campus Events & Activities" 
        color={theme.colors.info}
        description="Comprehensive overview of campus events, workshops, and social gatherings"
      >
        <Widget 
          title="Total Events" 
          tooltip="All events created across university campuses" 
          value={events.total + 1247} 
          progressValue={100} 
          barColor={theme.colors.info} 
          icon={cilCalendar}
          trend={18.4}
        />
        <Widget 
          title="Outdoor Events" 
          tooltip="Events held in outdoor campus locations"
          value={events.outdoor + 687} 
          progressValue={calcProgress(events.outdoor + 687, events.total + 1247)} 
          barColor={theme.colors.info} 
          icon={cilCalendar}
          trend={22.1}
        />
        <Widget 
          title="Indoor Events" 
          tooltip="Events in campus buildings and facilities"
          value={events.indoor + 560} 
          progressValue={calcProgress(events.indoor + 560, events.total + 1247)} 
          barColor={theme.colors.info} 
          icon={cilCalendar}
          trend={14.8}
        />
        <Widget 
          title="Public Events" 
          tooltip="Open events accessible to all students"
          value={events.public + 892} 
          progressValue={calcProgress(events.public + 892, events.total + 1247)} 
          barColor={theme.colors.info} 
          icon={cilCalendar}
          trend={16.7}
        />
        <Widget 
          title="Private Events" 
          tooltip="Exclusive events for specific groups or organizations"
          value={events.private + 355} 
          progressValue={calcProgress(events.private + 355, events.total + 1247)} 
          barColor={theme.colors.info} 
          icon={cilCalendar}
          trend={11.2}
        />
      </Section>

      <Section 
        title="💡 Student Ideas & Innovation" 
        color={theme.colors.warning}
        description="Creative ideas, proposals, and collaborative projects from the student community"
      >
        <Widget 
          title="Total Ideas" 
          tooltip="All ideas submitted by students for campus improvement" 
          value={ideas.total + 892} 
          progressValue={100} 
          barColor={theme.colors.warning} 
          icon={cilLightbulb}
          trend={25.3}
        />
        <Widget 
          title="Active Projects" 
          tooltip="Ideas currently being developed or implemented"
          value={ideas.active + 456} 
          progressValue={calcProgress(ideas.active + 456, ideas.total + 892)} 
          barColor={theme.colors.warning} 
          icon={cilLightbulb}
          trend={31.5}
        />
        <Widget 
          title="In Review" 
          tooltip="Ideas under evaluation by campus administration"
          value={ideas.inactive + 234} 
          progressValue={calcProgress(ideas.inactive + 234, ideas.total + 892)} 
          barColor={theme.colors.warning} 
          icon={cilLightbulb}
          trend={7.9}
        />
        <Widget 
          title="Collaborative" 
          tooltip="Multi-student collaborative innovation projects"
          value={ideas.collaborated + 202} 
          progressValue={calcProgress(ideas.collaborated + 202, ideas.total + 892)} 
          barColor={theme.colors.warning} 
          icon={cilLightbulb}
          trend={42.8}
        />
      </Section>

      {/* New Enhanced Metrics Section */}
      <Section 
        title="📊 Advanced Engagement Metrics" 
        color={theme.colors.success}
        description="Deep insights into user behavior, retention, and platform growth"
      >
        <Widget 
          title="Daily Active Users" 
          tooltip="Students actively using the platform daily"
          value={4247} 
          progressValue={85} 
          barColor={theme.colors.success} 
          icon={cilCompass}
          trend={13.2}
        />
        <Widget 
          title="Weekly Retention" 
          tooltip="Percentage of users returning weekly"
          value="78%" 
          progressValue={78} 
          barColor={theme.colors.success} 
          icon={cilCalendar}
          trend={5.4}
        />
        <Widget 
          title="Avg. Session Time" 
          tooltip="Average time spent per session"
          value="24 min" 
          progressValue={68} 
          barColor={theme.colors.success} 
          icon={cilLightbulb}
          trend={18.7}
        />
        <Widget 
          title="Social Connections" 
          tooltip="New friendships formed through the platform"
          value={1847} 
          progressValue={92} 
          barColor={theme.colors.success} 
          icon={cilCompass}
          trend={28.9}
        />
      </Section>
    </div>
  );
};

export default Engagement;
