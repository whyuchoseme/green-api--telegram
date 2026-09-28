import clsx from "clsx";

import styles from "./Container.module.scss";

type ContainerProps = {
  className?: string;
  children: React.ReactNode;
};

export const Container = ({ className, children }: ContainerProps) => {
  return (
    <div
      className={clsx(
        styles["container"],

        className,
      )}
    >
      {children}
    </div>
  );
};
