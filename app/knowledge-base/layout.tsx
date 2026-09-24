import { KbHeader } from "@/components/kb/KbHeader";
import { ModuleTree } from "@/components/kb/ModuleTree";
import { RightRail } from "@/components/kb/RightRail";
import { getModules, getMyRequests, getRecentUpdates } from "@/lib/kb/queries";
import styles from "./layout.module.css";

export default async function KnowledgeBaseLayout({ children }: { children: React.ReactNode }) {
  const [modules, updates, requests] = await Promise.all([
    getModules(),
    getRecentUpdates(3),
    getMyRequests(3),
  ]);

  return (
    <div className={styles.shell}>
      <KbHeader initials="IT" />
      <div className={styles.grid}>
        <ModuleTree modules={modules} />
        <main className={styles.main}>{children}</main>
        <RightRail updates={updates} requests={requests} />
      </div>
    </div>
  );
}
