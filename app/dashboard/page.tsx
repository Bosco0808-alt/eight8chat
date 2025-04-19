import { auth } from "@/lib/auth";
import ChangeDisplayName from "./ChangeDisplayName";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <>
      <h1 className="m-2">👤 {session?.user?.name ?? "No Name"}</h1>
      <ChangeDisplayName userid={Number(session?.user?.id) || 0} />
    </>
  );
};

export default Dashboard;
