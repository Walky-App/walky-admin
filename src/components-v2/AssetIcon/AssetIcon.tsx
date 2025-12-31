import React from "react";
import IconMap from "./icons.generated";
import { AssetIconProps } from "./AssetIcon.types";

const AssetIcon: React.FC<AssetIconProps> = ({
  name,
  size,
  color,
  fill,
  strokeColor,
  className = "",
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
      width={size ?? undefined}
      height={size ?? undefined}
      className={className}
      onClick={onClick}
      style={{
        color: color || "currentColor",
        ...(fill ? { fill: fill } : {}),
        ...(strokeColor ? { stroke: strokeColor } : {}),
        ...style,
      }}
    />
  );
};

export default AssetIcon;
export { AssetIcon };
export type { AssetIconProps, IconName } from "./AssetIcon.types";
