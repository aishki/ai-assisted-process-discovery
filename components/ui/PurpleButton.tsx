import Link from "next/link";
import styles from "./PurpleButton.module.css";

type Variant = "solid" | "outline" | "inverse";

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  /** Extra class for context-specific tweaks, e.g. an outline on a dark surface. */
  className?: string;
} & (
  | ({ href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className">)
  | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">)
);

/** BITS Design System `PurpleButton`: 38px pill, 16/600 label. */
export function PurpleButton({ children, variant = "solid", className: extra, ...rest }: Props) {
  const className = [styles.button, styles[variant], extra].filter(Boolean).join(" ");
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
