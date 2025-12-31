export type IconName = 'areaOfStudy' | 'arrow-down' | 'arrow-large-left-icon' | 'arrow-up' | 'braanned-students-icon' | 'calendar-icon' | 'camera-icon' | 'campus-icon' | 'chat-icon' | 'check-copy-icon' | 'check-icon' | 'close-button' | 'copy-icon' | 'delete-icon' | 'dog' | 'double-users-icon' | 'explore' | 'export-icon' | 'flag-icon' | 'grid-icon' | 'hamburguer-icon' | 'heart' | 'ideas-icons' | 'ideia-icon' | 'interests' | 'languages' | 'location-icon' | 'lock-icon' | 'logo-walky-white' | 'logout-icon' | 'map-icon' | 'menu-logo-walky' | 'mod-empty-table-icon' | 'mod-filter-icon' | 'mod-table-icon' | 'mod-table-pause-icon' | 'mod-table-search-icon' | 'nd-bar-chart' | 'nd-donut-chart' | 'nd-graf-icon' | 'nd-grafs-empty' | 'nd-report-icon' | 'nd-stacked-bar' | 'parent' | 'peers' | 'pending-review-icon' | 'plus-icon' | 'popular-emoji-icon' | 'present' | 'privite-event-icon' | 'public-event-icon' | 'red-flag-icon' | 'right-arrow-icon' | 'school-icon' | 'search-icon' | 'space-icon' | 'stats-icon' | 'student-behavior-icon' | 'study' | 'swap-arrows-icon' | 'sync-icon' | 'table-icon' | 'tooltip-icon' | 'top-fields-study-icon' | 'top-interests-icon' | 'trend-down-icon' | 'trend-up-icon' | 'trend-up-red' | 'under-evaluation-icon' | 'user-interactions-icon' | 'vertical-3-dots-icon' | 'visited-places-icon' | 'walk' | 'ways-to-connect' | 'wb-sunny-icon' | 'x-icon';

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
