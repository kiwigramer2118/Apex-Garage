import { NavShell } from "@/components/nav/NavShell";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <NavShell>{children}</NavShell>;
}
