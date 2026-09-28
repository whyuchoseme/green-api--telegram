import type { ComponentProps } from "react";

import clsx from "clsx";
import styles from "./ChatItem.module.scss";

type ChatItemProps = ComponentProps<"button"> & {
  isActive?: boolean;
  name: string;
};

export const ChatItem = ({
  isActive,
  name,
  className,
  ...rest
}: ChatItemProps) => {
  return (
    <button
      type="button"
      className={clsx(
        styles["chat-item"],
        isActive && styles["chat-item--active"],
        className,
      )}
      {...rest}
    >
      {name}
    </button>
  );
};
