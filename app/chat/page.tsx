import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Chat = async () => {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }
  if (!session.user?.name) {
    redirect("/welcome");
  }
  return <>{session.user?.name}</>;
};

export default Chat;
