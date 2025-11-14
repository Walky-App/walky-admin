import { FC, SVGProps } from 'react';
import arrowDown from '../../assets-v2/svg/arrow-down.svg?react';
import arrowUp from '../../assets-v2/svg/arrow-up.svg?react';
import campusIcon from '../../assets-v2/svg/campus-icon.svg?react';
import hamburguerIcon from '../../assets-v2/svg/hamburguer-icon.svg?react';
import logoWalkyWhite from '../../assets-v2/svg/logo-walky-white.svg?react';
import menuLogoWalky from '../../assets-v2/svg/menu-logo-walky.svg?react';
import schoolIcon from '../../assets-v2/svg/school-icon.svg?react';
import wbSunnyIcon from '../../assets-v2/svg/wb-sunny-icon.svg?react';

const IconMap: Record<string, FC<SVGProps<SVGSVGElement>>> = {
  'arrow-down': arrowDown,
  'arrow-up': arrowUp,
  'campus-icon': campusIcon,
  'hamburguer-icon': hamburguerIcon,
  'logo-walky-white': logoWalkyWhite,
  'menu-logo-walky': menuLogoWalky,
  'school-icon': schoolIcon,
  'wb-sunny-icon': wbSunnyIcon,
};

export default IconMap;
export type GeneratedIconKeys = keyof typeof IconMap;
