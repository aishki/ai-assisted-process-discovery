"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PurpleButton } from "@/components/ui/PurpleButton";
import { api, isAbort } from "@/lib/requests/client";
import { TOPICS } from "@/lib/requests/config";
import type { ChatMessage, InterviewTurnRequest, InterviewTurnResponse, RequestDraft } from "@/lib/requests/types";
import { StepHeading } from "../StepHeading";
import styles from "./InterviewStep.module.css";

type Props = {
  draft: RequestDraft;
  /** Adds the requester's message right away, before the AI replies. */
  onUserMessage: (text: string) => void;
  onTurn: (response: InterviewTurnResponse, turn: InterviewTurnRequest) => void;
  onNext: () => void;
};

const FLAG_TEXT = "Not sure — flagging this for the ABA.";

export function InterviewStep({ draft, onUserMessage, onTurn, onNext }: Props) {
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState<InterviewTurnRequest | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const complete = draft.topic >= TOPICS.length;

  const run = useCallback(
    async (turn: InterviewTurnRequest) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setPending(true);
      setFailed(null);
      try {
        const response = await api.interview(turn, controller.signal);
        onTurn(response, turn);
        setPending(false);
        if (!response.complete) inputRef.current?.focus({ preventScroll: true });
      } catch (err) {
        if (isAbort(err)) return;
        console.error("Interview turn failed", err);
        setPending(false);
        setFailed(turn);
      }
    },
    [onTurn],
  );

  // Open with the greeting and first question.
  const needsStart = draft.messages.length === 0;
  useEffect(() => {
    if (!needsStart) return;
    run({ action: "start" });
    return () => abortRef.current?.abort();
  }, [needsStart, run]);

  // Leaving the step cancels any reply still on its way.
  useEffect(() => () => abortRef.current?.abort(), []);

  // Keep the newest message in view.
  useEffect(() => {
    // Instant: a smooth scroll gets cancelled when focus moves back to the composer.
    const log = logRef.current;
    if (log) log.scrollTo({ top: log.scrollHeight });
  }, [draft.messages.length, pending, failed]);

  const send = () => {
    const answer = text.trim();
    if (!answer || pending || complete) return;
    onUserMessage(answer);
    setText("");
    run({ action: "answer", topic: draft.topic, text: answer, followUpAsked: draft.followUpAsked });
  };

  const flag = () => {
    if (pending || complete) return;
    onUserMessage(FLAG_TEXT);
    run({ action: "flag", topic: draft.topic });
  };

  return (
    <>
      <StepHeading step={2} title="A few questions where details are thin" />

      <ul className={styles.topics} aria-label="Interview topics">
        {TOPICS.map((label, i) => {
          const status = draft.answers[i];
          const current = !complete && i === draft.topic;
          const cls = status === "flagged" ? styles.flagged : status ? styles.answered : current ? styles.current : "";
          return (
            <li key={label} className={`${styles.topic} ${cls}`} aria-current={current ? "step" : undefined}>
              {status === "flagged" ? <span aria-hidden="true">!</span> : status ? <span aria-hidden="true">✓</span> : null}
              {label}
              <span className="sr-only">
                {status === "flagged" ? " — flagged for ABA" : status ? " — answered" : current ? " — current" : ""}
              </span>
            </li>
          );
        })}
      </ul>

      <div className={styles.panel}>
        <div ref={logRef} className={styles.log} role="log" aria-live="polite" aria-label="Interview">
          {draft.messages.map((m) => (
            <Message key={m.id} message={m} />
          ))}
          {pending && (
            <div className={styles.typing}>
              <span className={styles.avatar} aria-hidden="true">
                AI
              </span>
              <span>{draft.messages.length === 0 ? "Reading your charter…" : "Reading your answer…"}</span>
            </div>
          )}
          {failed && (
            <div className={styles.failed} role="alert">
              <span>The interviewer didn’t respond.</span>
              <button type="button" onClick={() => run(failed)}>
                Try again
              </button>
            </div>
          )}
        </div>

        {complete && !pending ? (
          <div className={styles.done}>
            <span>Interview complete. Review your readiness before submitting.</span>
            <PurpleButton withArrow onClick={onNext}>
              Review request
            </PurpleButton>
          </div>
        ) : (
          <form
            className={styles.composer}
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <textarea
              ref={inputRef}
              rows={2}
              value={text}
              maxLength={4000}
              placeholder="Type your answer — Enter to send"
              aria-label={`Your answer${complete ? "" : ` about ${TOPICS[draft.topic].toLowerCase()}`}`}
              className={styles.input}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <button type="button" className={styles.flag} disabled={pending || !!failed} onClick={flag}>
              Not sure — flag for ABA
            </button>
            <PurpleButton type="submit" disabled={pending || !!failed || !text.trim()}>
              Send
            </PurpleButton>
          </form>
        )}
      </div>
    </>
  );
}

function Message({ message }: { message: ChatMessage }) {
  const ai = message.from === "ai";
  return (
    <div className={`${styles.message} ${ai ? styles.fromAi : styles.fromUser}`}>
      {ai && (
        <span className={styles.avatar} aria-hidden="true">
          AI
        </span>
      )}
      <div className={styles.bubbleWrap}>
        {message.tag && <span className={styles.tag}>{message.tag}</span>}
        <p className={styles.bubble}>
          <span className="sr-only">{ai ? "AI: " : "You: "}</span>
          {message.text}
        </p>
      </div>
    </div>
  );
}
