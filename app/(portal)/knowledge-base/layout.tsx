import { ModuleTree } from "@/components/kb/ModuleTree";
import { RightRail } from "@/components/kb/RightRail";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { getModules, getMyRequests, getRecentUpdates } from "@/lib/kb/queries";

export default async function KnowledgeBaseLayout({ children }: { children: React.ReactNode }) {
  const [modules, updates, requests] = await Promise.all([
    getModules(),
    getRecentUpdates(3),
    getMyRequests(3),
  ]);

  return (
    <ThreeColumnLayout left={<ModuleTree modules={modules} />} right={<RightRail updates={updates} requests={requests} />}>
      {children}
    </ThreeColumnLayout>
  );
}
