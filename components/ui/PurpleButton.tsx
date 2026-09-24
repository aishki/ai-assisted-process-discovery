import Link from "next/link";
import styles from "./PurpleButton.module.css";

type Variant = "solid" | "outline" | "inverse";

type Props = {
  children: React.ReactNode;
  variant?: Variant;
} & (
  | ({ href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className">)
  | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">)
);

/** BITS Design System `PurpleButton`: 38px pill, 16/600 label. */
export function PurpleButton({ children, variant = "solid", ...rest }: Props) {
  const className = `${styles.button} ${styles[variant]}`;
  if (rest.href !== undefined) {
    return (
      <Link className={className} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={className} {...rest}>
      {children}
    </button>
  );
}
