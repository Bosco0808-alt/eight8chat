import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import MainContent from "./maincontent";

const Chat = async () => {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }
  if (!session.user?.name) {
    redirect("/welcome");
  }
  return <MainContent user={session.user} />;
};

export default Chat;
