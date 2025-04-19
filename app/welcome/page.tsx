import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DisplayNameForm from "../displaynameform";

const Welcome = async () => {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }
  if (session?.user?.name) {
    redirect("/chat");
  }
  return (
    <>
      <h1 className="m-2">Welcome to eight8chat!</h1>
      {/* im too lazy */
      /* @ts-ignore */}
      <DisplayNameForm userid={Number(session.user?.id)} welcome={true} />
    </>
  );
};

export default Welcome;
