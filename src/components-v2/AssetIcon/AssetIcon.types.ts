export type IconName = 'bell-notification' | 'calendar-event' | 'campus-icon' | 'hamburger-menu' | 'school-icon' | 'trend-down' | 'trend-up' | 'user-group';

export interface AssetIconProps {
  name: IconName;
  size?: number | string;
  color?: string;
  strokeColor?: string;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}
