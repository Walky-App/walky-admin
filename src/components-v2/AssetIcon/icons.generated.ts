import { FC, SVGProps } from 'react';
import bellNotification from '../../assets-v2/svg/bell-notification.svg?react';
import calendarEvent from '../../assets-v2/svg/calendar-event.svg?react';
import campusIcon from '../../assets-v2/svg/campus-icon.svg?react';
import hamburgerMenu from '../../assets-v2/svg/hamburger-menu.svg?react';
import schoolIcon from '../../assets-v2/svg/school-icon.svg?react';
import trendDown from '../../assets-v2/svg/trend-down.svg?react';
import trendUp from '../../assets-v2/svg/trend-up.svg?react';
import userGroup from '../../assets-v2/svg/user-group.svg?react';

const IconMap: Record<string, FC<SVGProps<SVGSVGElement>>> = {
  'bell-notification': bellNotification,
  'calendar-event': calendarEvent,
  'campus-icon': campusIcon,
  'hamburger-menu': hamburgerMenu,
  'school-icon': schoolIcon,
  'trend-down': trendDown,
  'trend-up': trendUp,
  'user-group': userGroup,
};

export default IconMap;
export type GeneratedIconKeys = keyof typeof IconMap;
