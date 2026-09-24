import type { Metadata } from "next";
import { ComingSoon } from "@/components/portal/ComingSoon";
import { PLACEHOLDERS } from "@/lib/routes";

const area = PLACEHOLDERS.ownership;

export const metadata: Metadata = { title: `${area.title} · BITS Automation Portal` };

export default function Page() {
  return <ComingSoon {...area} />;
}
