import styles from "./ChoicePill.module.css";

type Props = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> & { selected: boolean };

/** 38px toggle pill with a purple ring; filled when selected. Used for yes/no and single-select sets. */
export function ChoicePill({ selected, children, ...rest }: Props) {
  return (
    <button type="button" aria-pressed={selected} className={styles.pill} {...rest}>
      {children}
    </button>
  );
}
