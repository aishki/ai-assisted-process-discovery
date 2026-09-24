import type { Metadata } from "next";
import { RequestFlow } from "@/components/request/RequestFlow";

export const metadata: Metadata = { title: "New automation request · BITS" };

export default function NewRequestPage() {
  return <RequestFlow initials="IT" />;
}
