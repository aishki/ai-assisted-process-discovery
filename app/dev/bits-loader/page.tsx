import type { Metadata } from "next";
import { BitsLoaderDemo } from "./BitsLoaderDemo";

export const metadata: Metadata = { title: "BITS loader demo" };

export default function BitsLoaderDemoPage() {
  return <BitsLoaderDemo />;
}
