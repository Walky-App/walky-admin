export type IconName =
  | "arrow-down"
  | "arrow-up"
  | "calendar-icon"
  | "campus-icon"
  | "copy-icon"
  | "double-users-icon"
  | "export-icon"
  | "grid-icon"
  | "hamburguer-icon"
  | "ideas-icons"
  | "lock-icon"
  | "logo-walky-white"
  | "map-icon"
  | "menu-logo-walky"
  | "popular-emoji-icon"
  | "school-icon"
  | "search-icon"
  | "space-icon"
  | "student-behavior-icon"
  | "swap-arrows-icon"
  | "table-icon"
  | "tooltip-icon"
  | "top-fields-study-icon"
  | "top-interests-icon"
  | "trend-down-icon"
  | "trend-up-icon"
  | "user-interactions-icon"
  | "visited-places-icon"
  | "wb-sunny-icon";

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
