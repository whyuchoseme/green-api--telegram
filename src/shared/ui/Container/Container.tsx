import clsx from "clsx";

import styles from "./Container.module.scss";

type ContainerProps = {
  viewVariant?: "stretch";
  children: React.ReactNode;
};

export const Container = ({ viewVariant, children }: ContainerProps) => {
  return (
    <div
      className={clsx(
        styles["container"],
        viewVariant && styles[`container--${viewVariant}`],
      )}
    >
      {children}
    </div>
  );
};
