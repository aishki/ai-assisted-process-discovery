import { tokenize } from "@/lib/kb/search";
import styles from "./Highlight.module.css";

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Wraps each query word found in `text` in a <mark>. Works in server and client components. */
export function Highlight({ text, query }: { text: string; query: string }) {
  const tokens = tokenize(query);
  if (tokens.length === 0) return <>{text}</>;

  const pattern = new RegExp(`(${tokens.map(escape).join("|")})`, "gi");
  return (
    <>
      {text.split(pattern).map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className={styles.mark}>
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}
