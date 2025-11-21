export type IconName = 'arrow-down' | 'arrow-up' | 'braanned-students-icon' | 'calendar-icon' | 'campus-icon' | 'chat-icon' | 'check-icon' | 'close-button' | 'copy-icon' | 'double-users-icon' | 'export-icon' | 'flag-icon' | 'grid-icon' | 'hamburguer-icon' | 'ideas-icons' | 'ideia-icon' | 'location-icon' | 'lock-icon' | 'logo-walky-white' | 'map-icon' | 'menu-logo-walky' | 'popular-emoji-icon' | 'privite-event-icon' | 'public-event-icon' | 'school-icon' | 'search-icon' | 'space-icon' | 'stats-icon' | 'student-behavior-icon' | 'swap-arrows-icon' | 'table-icon' | 'tooltip-icon' | 'top-fields-study-icon' | 'top-interests-icon' | 'trend-down-icon' | 'trend-up-icon' | 'trend-up-red' | 'user-interactions-icon' | 'vertical-3-dots-icon' | 'visited-places-icon' | 'wb-sunny-icon' | 'x-icon';

export interface AssetIconProps {
  name: IconName;
  fill?: string;
  size?: number | string;
  color?: string;
  strokeColor?: string;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}
