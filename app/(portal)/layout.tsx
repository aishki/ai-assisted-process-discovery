import { PortalHeader } from "@/components/kb/PortalHeader";
import { getSearchIndex } from "@/lib/kb/queries";
import styles from "./layout.module.css";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const searchIndex = await getSearchIndex();

  return (
    <div className={styles.shell}>
      <PortalHeader initials="IT" searchIndex={searchIndex} />
      {children}
    </div>
  );
}
