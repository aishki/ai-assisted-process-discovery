import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StatusPill } from "@/components/kb/RightRail";
import { ComingSoon } from "@/components/portal/ComingSoon";
import { getRequest } from "@/lib/kb/queries";
import styles from "./page.module.css";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `${id} · My requests · BITS Automation Portal` };
}

export default async function RequestPage({ params }: Props) {
  const { id } = await params;
  const request = await getRequest(id);
  if (!request) notFound();

  return (
    <ComingSoon
      title={`Request ${request.id}`}
      module="Module 2"
      body="The full request, its review history and any open questions will show here once My requests is live."
      showChecklist
    >
      <div className={styles.status}>
        <span className={styles.label}>Current status</span>
        <StatusPill status={request.status} />
      </div>
    </ComingSoon>
  );
}
