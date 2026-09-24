import type { Metadata } from "next";
import { ComingSoon } from "@/components/portal/ComingSoon";
import { PLACEHOLDERS } from "@/lib/routes";

const area = PLACEHOLDERS.myRequests;

export const metadata: Metadata = { title: `${area.title} · BITS Automation Portal` };

export default function Page() {
  return <ComingSoon {...area} showChecklist />;
}
