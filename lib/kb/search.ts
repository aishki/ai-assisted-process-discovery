import type { KbSearchEntry, KbSearchHit } from "./types";

// Plain keyword scoring, shared by the header typeahead (client), the results page
// and POST /kb/ask (server). Replace with the search API when there is one.

const STOP_WORDS = new Set(
  "a an and are be can do does for how i in is it my of on or should the to use what when which who why with".split(" "),
);

export const tokenize = (q: string) =>
  q
    .toLowerCase()
    .split(/[^a-z0-9.]+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));

/** A window of `text` around the first query word, for result snippets. */
export function snippet(text: string, query: string, length = 170): string {
  if (text.length <= length) return text;
  const lower = text.toLowerCase();
  const first = tokenize(query)
    .map((t) => lower.indexOf(t))
    .filter((i) => i >= 0)
    .sort((a, b) => a - b)[0];
  const start = first === undefined ? 0 : Math.max(0, first - 50);
  const cut = text.slice(start, start + length);
  return `${start > 0 ? "…" : ""}${cut.trim()}${start + length < text.length ? "…" : ""}`;
}

export function searchEntries(index: KbSearchEntry[], query: string, limit = 20): KbSearchHit[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const hits: KbSearchHit[] = [];
  for (const entry of index) {
    const title = entry.title.toLowerCase();
    const context = entry.context.toLowerCase();
    const text = entry.text.toLowerCase();
    let score = 0;
    let matched = 0;
    for (const t of tokens) {
      const inTitle = title.includes(t);
      const inContext = context.includes(t);
      const inText = text.includes(t);
      if (inTitle || inContext || inText) matched++;
      if (inTitle) score += title.startsWith(t) ? 4 : 3;
      if (inContext) score += 1;
      if (inText) score += 1;
    }
    // Every word has to appear somewhere, so longer queries narrow the list.
    if (matched === tokens.length) {
      hits.push({ ...entry, score: score + (entry.kind === "page" ? 0.5 : 0) });
    }
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}
