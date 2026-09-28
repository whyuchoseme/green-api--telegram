import { type ComponentProps, forwardRef } from "react";

import clsx from "clsx";
import styles from "./Input.module.scss";

type InputProps = ComponentProps<"input"> & {
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...rest }, ref) => {
    return (
      <>
        <input
          ref={ref}
          className={clsx(
            styles["input"],
            error && styles["input--error"],
            className,
          )}
          {...rest}
        />
        {error && <div className={styles["error-tooltip"]}>{error}</div>}
      </>
    );
  },
);
Input.displayName = "Input";
