import Sidebar from "./Sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function chatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }
  if (!session.user?.name) {
    redirect("/welcome");
  }
  return (
    <>
      <Sidebar userId={Number(session?.user?.id) || null}>{children}</Sidebar>
    </>
  );
}
