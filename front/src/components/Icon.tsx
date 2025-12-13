import clsx from "classnames";
import type React from "react";

type Props = {
  id: string;
  width?: number;
  height?: number;
  className?: string;
  title?: string;
  style?: React.CSSProperties;
};

export default function Icon({
  id,
  width,
  height,
  className,
  title,
  style,
}: Props) {
  return (
    <svg
      width={width}
      height={height}
      aria-hidden={title ? undefined : true}
      className={clsx(className)}
      style={style}
    >
      {title && <title>{title}</title>}
      <use href={`/img/sprite/sprite.svg?v=6#${id}`} xlinkHref={`#${id}`} />
    </svg>
  );
}
