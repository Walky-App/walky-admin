export type IconName = 'arrow-down' | 'arrow-up' | 'campus-icon' | 'hamburguer-icon' | 'menu-logo-walky' | 'school-icon' | 'wb-sunny-icon';

export interface AssetIconProps {
  name: IconName;
  size?: number | string;
  color?: string;
  strokeColor?: string;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}
