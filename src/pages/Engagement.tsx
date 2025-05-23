import React, { useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
import { cilCompass, cilCalendar, cilLightbulb } from '@coreui/icons'
import { CTooltip } from '@coreui/react'
import { useTheme } from '../hooks/useTheme'
import API from '../API'

// 🔹 Widget Component
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
  const { theme } = useTheme();
  const isDark = theme.isDark;

  const widgetContent = (
    <div
      style={{
        width: '160px',
        backgroundColor: isDark ? '#2a2d36' : '#f8f9fa',
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
          color: isDark ? '#d1d5db' : '#000',
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
        }}
      />

      <div style={{ paddingTop: '1.5rem' }}>
        <strong style={{ fontSize: '1.2rem', color: isDark ? '#d1d5db' : '#000' }}>{value}</strong>
        <div style={{ color: isDark ? '#d1d5db' : '#6c757d', fontSize: '0.9rem' }}>{title}</div>
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

  return tooltip ? <CTooltip content={tooltip}>{widgetContent}</CTooltip> : widgetContent;
};

// 🔹 Section Component
const Section = ({
  title,
  color,
  children,
}: {
  title: string
  color: string
  children: React.ReactNode
}) => {
  const { theme } = useTheme();
  const isDark = theme.isDark;

  return (
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
      <h5 style={{ color: isDark ? '#e5e7eb' : 'white', marginBottom: '1rem' }}>{title}</h5>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          rowGap: '1rem',
          columnGap: '0.75rem',
          justifyContent: 'flex-start',
        }}
      >
        {children}
      </div>
    </div>
  );
};

// 🔸 Main Page
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

  return (
    <div style={{ padding: '2rem' }}>
      <Section title="Walks" color="#6f42c1">
        <Widget title="Total Walks" tooltip="Number of total walks recorded" value={walks.total} progressValue={100} barColor="#6f42c1" icon={cilCompass} />
        <Widget title="Pending" value={walks.pending} progressValue={Math.round((walks.pending / walks.total) * 100)} barColor="#6f42c1" icon={cilCompass} />
        <Widget title="Active" value={walks.active} progressValue={Math.round((walks.active / walks.total) * 100)} barColor="#6f42c1" icon={cilCompass} />
        <Widget title="Completed" value={walks.completed} progressValue={Math.round((walks.completed / walks.total) * 100)} barColor="#6f42c1" icon={cilCompass} />
        <Widget title="Cancelled/Closed" value={walks.cancelled} progressValue={Math.round((walks.cancelled / walks.total) * 100)} barColor="#6f42c1" icon={cilCompass} />
      </Section>


      <Section title="Events" color="#42a5f5">
        <Widget title="Total Events" tooltip="Number of total events created" value={events.total} progressValue={100} barColor="#42a5f5" icon={cilCalendar} />
        <Widget title="Outdoor" value={events.outdoor} progressValue={calcProgress(events.outdoor, events.total)} barColor="#42a5f5" icon={cilCalendar} />
        <Widget title="Indoor" value={events.indoor} progressValue={calcProgress(events.indoor, events.total)} barColor="#42a5f5" icon={cilCalendar} />
        <Widget title="Public" value={events.public} progressValue={calcProgress(events.public, events.total)} barColor="#42a5f5" icon={cilCalendar} />
        <Widget title="Private" value={events.private} progressValue={calcProgress(events.private, events.total)} barColor="#42a5f5" icon={cilCalendar} />
      </Section>

      <Section title="Ideas" color="#f0ad4e">
        <Widget title="Total Ideas" tooltip="Number of total ideas created" value={ideas.total} progressValue={100} barColor="#f0ad4e" icon={cilLightbulb} />
        <Widget title="Active" value={ideas.active} progressValue={calcProgress(ideas.active, ideas.total)} barColor="#f0ad4e" icon={cilLightbulb} />
        <Widget title="Inactive" value={ideas.inactive} progressValue={calcProgress(ideas.inactive, ideas.total)} barColor="#f0ad4e" icon={cilLightbulb} />
        <Widget title="Collaborated" value={ideas.collaborated} progressValue={calcProgress(ideas.collaborated, ideas.total)} barColor="#f0ad4e" icon={cilLightbulb} />
      </Section>
    </div>
  );
};

export default Engagement;
