import Link from "next/link";
import styles from "./PurpleButton.module.css";

type Variant = "solid" | "outline" | "inverse";

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  /** Trailing arrow, as on the design system's forward actions. */
  withArrow?: boolean;
  /** Extra class for context-specific tweaks, e.g. an outline on a dark surface. */
  className?: string;
} & (
  | ({ href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className">)
  | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">)
);

/** BITS Design System `PurpleButton`: 38px pill, 16/600 label. */
export function PurpleButton({ children, variant = "solid", withArrow = false, className: extra, ...rest }: Props) {
  const className = [styles.button, styles[variant], extra].filter(Boolean).join(" ");
  const content = (
    <>
      {children}
      {withArrow && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      )}
    </>
  );
  if (rest.href !== undefined) {
    return (
      <Link className={className} {...rest}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" className={className} {...rest}>
      {content}
    </button>
  );
}
