"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { KbAskResponse } from "@/lib/kb/types";
import { ASK_INPUT_ID, kbSearchHref } from "@/lib/routes";
import { SendIcon } from "./icons";
import styles from "./AskBox.module.css";

type State =
  | { status: "idle" }
  | { status: "loading"; question: string }
  | { status: "answered"; question: string; result: KbAskResponse }
  | { status: "error"; question: string };

export function AskBox() {
  const [question, setQuestion] = useState("");
  const [state, setState] = useState<State>({ status: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const submit = async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setState({ status: "loading", question: trimmed });

    try {
      const res = await fetch("/api/kb/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(String(res.status));
      const result = (await res.json()) as KbAskResponse;
      setState({ status: "answered", question: trimmed, result });
    } catch (err) {
      if (controller.signal.aborted) return;
      console.error("Ask the knowledge base failed", err);
      setState({ status: "error", question: trimmed });
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setQuestion("");
    setState({ status: "idle" });
    inputRef.current?.focus();
  };

  const loading = state.status === "loading";

  return (
    <section className={styles.ask} aria-labelledby="kb-ask-title">
      <h2 id="kb-ask-title" className={styles.title}>
        Ask the knowledge base
      </h2>
      <p className={styles.note}>Answers are drafts and link back to the source page.</p>

      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          submit(question);
        }}
      >
        <input
          ref={inputRef}
          id={ASK_INPUT_ID}
          className={styles.input}
          aria-label="Ask the knowledge base"
          placeholder="Power Apps or web app?"
          maxLength={300}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          type="submit"
          className={styles.send}
          aria-label="Ask"
          disabled={loading || !question.trim()}
        >
          <SendIcon size={15} />
        </button>
      </form>

      <div aria-live="polite" aria-busy={loading}>
        {state.status === "loading" && (
          <div className={styles.loading}>
            <span className={styles.dots} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            Drafting an answer…
          </div>
        )}

        {state.status === "error" && (
          <div className={styles.card}>
            <p className={styles.text}>Couldn’t get an answer right now.</p>
            <div className={styles.actions}>
              <button type="button" className={styles.linkButton} onClick={() => submit(state.question)}>
                Try again
              </button>
              <Link href={kbSearchHref(state.question)} className={styles.linkButton}>
                Search instead
              </Link>
            </div>
          </div>
        )}

        {state.status === "answered" && (
          <div className={styles.card}>
            <p className={styles.asked}>“{state.question}”</p>
            {state.result.answer ? (
              <>
                <span className={styles.draft}>Draft answer</span>
                <p className={styles.text}>{state.result.answer}</p>
                <span className={styles.sourcesLabel}>Sources</span>
                <ul className={styles.sources}>
                  {state.result.sources.map((s) => (
                    <li key={s.href}>
                      <Link href={s.href} className={styles.source}>
                        <span className={styles.sourceTitle}>{s.title}</span>
                        <span className={styles.sourceContext}>{s.context}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className={styles.text}>
                I couldn’t find this in the knowledge base. Try different words, or{" "}
                <Link href={kbSearchHref(state.question)}>search for it</Link>.
              </p>
            )}
            <div className={styles.actions}>
              <button type="button" className={styles.linkButton} onClick={reset}>
                Ask another question
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
