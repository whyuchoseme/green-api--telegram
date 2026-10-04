import type { ComponentProps, ElementType } from "react";

import clsx from "clsx";
import styles from "./Button.module.scss";

type ButtonOwnProps<E extends ElementType = ElementType> = {
  className?: string;
  children: React.ReactNode;
  viewVariant?: "primary" | "secondary" | "accent" | "danger" | "back";
  as?: E;
};

type ButtonProps<E extends ElementType> = ButtonOwnProps<E> &
  Omit<ComponentProps<E>, keyof ButtonOwnProps>;

const defaultElement = "button";

export const Button = <E extends ElementType = typeof defaultElement>({
  className,
  children,
  viewVariant,
  as,
  ...rest
}: ButtonProps<E>) => {
  const Component = as || defaultElement;
  const defaultType = Component === defaultElement ? "button" : undefined;

  return (
    <Component
      type={defaultType}
      className={clsx(
        styles["button"],
        viewVariant && styles[`button--${viewVariant}`],
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
};
