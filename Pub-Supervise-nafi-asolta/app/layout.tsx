import "./globals.css";
import Navbar from "@/components/Navbar";
import { getUser } from "@/lib/auth";
import { ROLE_LABEL, primaryRole } from "@/lib/roles";
export async function generateMetadata() {
  const u = await getUser(); // the browser tab shows the role, so several logged-in tabs are easy to tell apart
  return { title: u ? `${ROLE_LABEL[primaryRole(u.roles as string[])]} | PubSupervise` : "PubSupervise | Pundra University of Science & Technology", description: "Thesis & project supervision portal", icons: { icon: "/logo.png" } };
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><Navbar />{children}</body></html>;
}
