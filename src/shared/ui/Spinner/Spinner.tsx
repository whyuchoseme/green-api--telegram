import styles from "./Spinner.module.scss";

export const Spinner = () => {
  return (
    <div className={styles["spinner-container"]}>
      <div className={styles["spinner"]} />
    </div>
  );
};
