import { redirect } from "next/navigation";
import { DEFAULT_PAGE } from "@/lib/kb/queries";

export default function KnowledgeBaseIndex() {
  redirect(`/knowledge-base/${DEFAULT_PAGE.moduleSlug}/${DEFAULT_PAGE.pageSlug}`);
}
