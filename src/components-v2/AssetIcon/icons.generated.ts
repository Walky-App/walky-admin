import { FC, SVGProps } from 'react';
import arrowDown from '../../assets-v2/svg/arrow-down.svg?react';
import arrowLargeLeftIcon from '../../assets-v2/svg/arrow-large-left-icon.svg?react';
import arrowUp from '../../assets-v2/svg/arrow-up.svg?react';
import braannedStudentsIcon from '../../assets-v2/svg/braanned-students-icon.svg?react';
import calendarIcon from '../../assets-v2/svg/calendar-icon.svg?react';
import campusIcon from '../../assets-v2/svg/campus-icon.svg?react';
import chatIcon from '../../assets-v2/svg/chat-icon.svg?react';
import checkCopyIcon from '../../assets-v2/svg/check-copy-icon.svg?react';
import checkIcon from '../../assets-v2/svg/check-icon.svg?react';
import closeButton from '../../assets-v2/svg/close-button.svg?react';
import copyIcon from '../../assets-v2/svg/copy-icon.svg?react';
import deleteIcon from '../../assets-v2/svg/delete-icon.svg?react';
import doubleUsersIcon from '../../assets-v2/svg/double-users-icon.svg?react';
import exportIcon from '../../assets-v2/svg/export-icon.svg?react';
import flagIcon from '../../assets-v2/svg/flag-icon.svg?react';
import gridIcon from '../../assets-v2/svg/grid-icon.svg?react';
import hamburguerIcon from '../../assets-v2/svg/hamburguer-icon.svg?react';
import ideasIcons from '../../assets-v2/svg/ideas-icons.svg?react';
import ideiaIcon from '../../assets-v2/svg/ideia-icon.svg?react';
import locationIcon from '../../assets-v2/svg/location-icon.svg?react';
import lockIcon from '../../assets-v2/svg/lock-icon.svg?react';
import logoWalkyWhite from '../../assets-v2/svg/logo-walky-white.svg?react';
import logoutIcon from '../../assets-v2/svg/logout-icon.svg?react';
import mapIcon from '../../assets-v2/svg/map-icon.svg?react';
import menuLogoWalky from '../../assets-v2/svg/menu-logo-walky.svg?react';
import modEmptyTableIcon from '../../assets-v2/svg/mod-empty-table-icon.svg?react';
import modFilterIcon from '../../assets-v2/svg/mod-filter-icon.svg?react';
import modTableIcon from '../../assets-v2/svg/mod-table-icon.svg?react';
import modTablePauseIcon from '../../assets-v2/svg/mod-table-pause-icon.svg?react';
import modTableSearchIcon from '../../assets-v2/svg/mod-table-search-icon.svg?react';
import ndBarChart from '../../assets-v2/svg/nd-bar-chart.svg?react';
import ndDonutChart from '../../assets-v2/svg/nd-donut-chart.svg?react';
import ndGrafsEmpty from '../../assets-v2/svg/nd-grafs-empty.svg?react';
import ndReportIcon from '../../assets-v2/svg/nd-report-icon.svg?react';
import ndStackedBar from '../../assets-v2/svg/nd-stacked-bar.svg?react';
import pendingReviewIcon from '../../assets-v2/svg/pending-review-icon.svg?react';
import plusIcon from '../../assets-v2/svg/plus-icon.svg?react';
import popularEmojiIcon from '../../assets-v2/svg/popular-emoji-icon.svg?react';
import priviteEventIcon from '../../assets-v2/svg/privite-event-icon.svg?react';
import publicEventIcon from '../../assets-v2/svg/public-event-icon.svg?react';
import redFlagIcon from '../../assets-v2/svg/red-flag-icon.svg?react';
import rightArrowIcon from '../../assets-v2/svg/right-arrow-icon.svg?react';
import schoolIcon from '../../assets-v2/svg/school-icon.svg?react';
import searchIcon from '../../assets-v2/svg/search-icon.svg?react';
import spaceIcon from '../../assets-v2/svg/space-icon.svg?react';
import statsIcon from '../../assets-v2/svg/stats-icon.svg?react';
import studentBehaviorIcon from '../../assets-v2/svg/student-behavior-icon.svg?react';
import swapArrowsIcon from '../../assets-v2/svg/swap-arrows-icon.svg?react';
import tableIcon from '../../assets-v2/svg/table-icon.svg?react';
import tooltipIcon from '../../assets-v2/svg/tooltip-icon.svg?react';
import topFieldsStudyIcon from '../../assets-v2/svg/top-fields-study-icon.svg?react';
import topInterestsIcon from '../../assets-v2/svg/top-interests-icon.svg?react';
import trendDownIcon from '../../assets-v2/svg/trend-down-icon.svg?react';
import trendUpIcon from '../../assets-v2/svg/trend-up-icon.svg?react';
import trendUpRed from '../../assets-v2/svg/trend-up-red.svg?react';
import underEvaluationIcon from '../../assets-v2/svg/under-evaluation-icon.svg?react';
import userInteractionsIcon from '../../assets-v2/svg/user-interactions-icon.svg?react';
import vertical3DotsIcon from '../../assets-v2/svg/vertical-3-dots-icon.svg?react';
import visitedPlacesIcon from '../../assets-v2/svg/visited-places-icon.svg?react';
import wbSunnyIcon from '../../assets-v2/svg/wb-sunny-icon.svg?react';
import xIcon from '../../assets-v2/svg/x-icon.svg?react';

const IconMap: Record<string, FC<SVGProps<SVGSVGElement>>> = {
  'arrow-down': arrowDown,
  'arrow-large-left-icon': arrowLargeLeftIcon,
  'arrow-up': arrowUp,
  'braanned-students-icon': braannedStudentsIcon,
  'calendar-icon': calendarIcon,
  'campus-icon': campusIcon,
  'chat-icon': chatIcon,
  'check-copy-icon': checkCopyIcon,
  'check-icon': checkIcon,
  'close-button': closeButton,
  'copy-icon': copyIcon,
  'delete-icon': deleteIcon,
  'double-users-icon': doubleUsersIcon,
  'export-icon': exportIcon,
  'flag-icon': flagIcon,
  'grid-icon': gridIcon,
  'hamburguer-icon': hamburguerIcon,
  'ideas-icons': ideasIcons,
  'ideia-icon': ideiaIcon,
  'location-icon': locationIcon,
  'lock-icon': lockIcon,
  'logo-walky-white': logoWalkyWhite,
  'logout-icon': logoutIcon,
  'map-icon': mapIcon,
  'menu-logo-walky': menuLogoWalky,
  'mod-empty-table-icon': modEmptyTableIcon,
  'mod-filter-icon': modFilterIcon,
  'mod-table-icon': modTableIcon,
  'mod-table-pause-icon': modTablePauseIcon,
  'mod-table-search-icon': modTableSearchIcon,
  'nd-bar-chart': ndBarChart,
  'nd-donut-chart': ndDonutChart,
  'nd-grafs-empty': ndGrafsEmpty,
  'nd-report-icon': ndReportIcon,
  'nd-stacked-bar': ndStackedBar,
  'pending-review-icon': pendingReviewIcon,
  'plus-icon': plusIcon,
  'popular-emoji-icon': popularEmojiIcon,
  'privite-event-icon': priviteEventIcon,
  'public-event-icon': publicEventIcon,
  'red-flag-icon': redFlagIcon,
  'right-arrow-icon': rightArrowIcon,
  'school-icon': schoolIcon,
  'search-icon': searchIcon,
  'space-icon': spaceIcon,
  'stats-icon': statsIcon,
  'student-behavior-icon': studentBehaviorIcon,
  'swap-arrows-icon': swapArrowsIcon,
  'table-icon': tableIcon,
  'tooltip-icon': tooltipIcon,
  'top-fields-study-icon': topFieldsStudyIcon,
  'top-interests-icon': topInterestsIcon,
  'trend-down-icon': trendDownIcon,
  'trend-up-icon': trendUpIcon,
  'trend-up-red': trendUpRed,
  'under-evaluation-icon': underEvaluationIcon,
  'user-interactions-icon': userInteractionsIcon,
  'vertical-3-dots-icon': vertical3DotsIcon,
  'visited-places-icon': visitedPlacesIcon,
  'wb-sunny-icon': wbSunnyIcon,
  'x-icon': xIcon,
};

export default IconMap;
export type GeneratedIconKeys = keyof typeof IconMap;
