import { auth } from "@/lib/auth";
import ChangeDisplayName from "./ChangeDisplayName";
import { redirect } from "next/navigation";
import Link from "next/link";

const Dashboard = async () => {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <div>
      <h1 className="m-2">👤 {session?.user?.name ?? "No Name"}</h1>
      <span className="m-2">ID: {session?.user?.id}</span>
      <br />
      <ChangeDisplayName userid={Number(session?.user?.id) || 0} />
      <br />
      <Link href="/api/auth/signout" className="btn btn-danger m-2">
        Sign Out
      </Link>
    </div>
  );
};

export default Dashboard;
