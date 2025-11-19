import { FC, SVGProps } from "react";
import arrowDown from "../../assets-v2/svg/arrow-down.svg?react";
import arrowUp from "../../assets-v2/svg/arrow-up.svg?react";
import calendarIcon from "../../assets-v2/svg/calendar-icon.svg?react";
import campusIcon from "../../assets-v2/svg/campus-icon.svg?react";
import copyIcon from "../../assets-v2/svg/copy-icon.svg?react";
import doubleUsersIcon from "../../assets-v2/svg/double-users-icon.svg?react";
import exportIcon from "../../assets-v2/svg/export-icon.svg?react";
import gridIcon from "../../assets-v2/svg/grid-icon.svg?react";
import hamburguerIcon from "../../assets-v2/svg/hamburguer-icon.svg?react";
import ideasIcons from "../../assets-v2/svg/ideas-icons.svg?react";
import lockIcon from "../../assets-v2/svg/lock-icon.svg?react";
import logoWalkyWhite from "../../assets-v2/svg/logo-walky-white.svg?react";
import mapIcon from "../../assets-v2/svg/map-icon.svg?react";
import menuLogoWalky from "../../assets-v2/svg/menu-logo-walky.svg?react";
import popularEmojiIcon from "../../assets-v2/svg/popular-emoji-icon.svg?react";
import schoolIcon from "../../assets-v2/svg/school-icon.svg?react";
import spaceIcon from "../../assets-v2/svg/space-icon.svg?react";
import studentBehaviorIcon from "../../assets-v2/svg/student-behavior-icon.svg?react";
import swapArrowsIcon from "../../assets-v2/svg/swap-arrows-icon.svg?react";
import tableIcon from "../../assets-v2/svg/table-icon.svg?react";
import tooltipIcon from "../../assets-v2/svg/tooltip-icon.svg?react";
import topFieldsStudyIcon from "../../assets-v2/svg/top-fields-study-icon.svg?react";
import topInterestsIcon from "../../assets-v2/svg/top-interests-icon.svg?react";
import trendDownIcon from "../../assets-v2/svg/trend-down-icon.svg?react";
import trendUpIcon from "../../assets-v2/svg/trend-up-icon.svg?react";
import userInteractionsIcon from "../../assets-v2/svg/user-interactions-icon.svg?react";
import visitedPlacesIcon from "../../assets-v2/svg/visited-places-icon.svg?react";
import wbSunnyIcon from "../../assets-v2/svg/wb-sunny-icon.svg?react";

const IconMap: Record<string, FC<SVGProps<SVGSVGElement>>> = {
  "arrow-down": arrowDown,
  "arrow-up": arrowUp,
  "calendar-icon": calendarIcon,
  "campus-icon": campusIcon,
  "copy-icon": copyIcon,
  "double-users-icon": doubleUsersIcon,
  "export-icon": exportIcon,
  "grid-icon": gridIcon,
  "hamburguer-icon": hamburguerIcon,
  "ideas-icons": ideasIcons,
  "lock-icon": lockIcon,
  "logo-walky-white": logoWalkyWhite,
  "map-icon": mapIcon,
  "menu-logo-walky": menuLogoWalky,
  "popular-emoji-icon": popularEmojiIcon,
  "school-icon": schoolIcon,
  "space-icon": spaceIcon,
  "student-behavior-icon": studentBehaviorIcon,
  "swap-arrows-icon": swapArrowsIcon,
  "table-icon": tableIcon,
  "tooltip-icon": tooltipIcon,
  "top-fields-study-icon": topFieldsStudyIcon,
  "top-interests-icon": topInterestsIcon,
  "trend-down-icon": trendDownIcon,
  "trend-up-icon": trendUpIcon,
  "user-interactions-icon": userInteractionsIcon,
  "visited-places-icon": visitedPlacesIcon,
  "wb-sunny-icon": wbSunnyIcon,
};

export default IconMap;
export type GeneratedIconKeys = keyof typeof IconMap;
