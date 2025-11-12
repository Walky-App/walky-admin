import React from 'react';
import IconMap from './icons.generated';
import { AssetIconProps } from './AssetIcon.types';

const AssetIcon: React.FC<AssetIconProps> = ({
  name,
  size = 24,
  color,
  strokeColor,
  className = '',
  onClick,
  style = {},
}) => {
  const SvgIcon = IconMap[name];
  if (!SvgIcon) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  return (
    <SvgIcon
      width={size}
      height={size}
      className={className}
      onClick={onClick}
      style={{
        color: color || 'currentColor',
        fill: color || 'currentColor',
        stroke: strokeColor || color || 'currentColor',
        ...style,
      }}
    />
  );
};

export default AssetIcon;
export { AssetIcon };
export type { AssetIconProps, IconName } from './AssetIcon.types';
