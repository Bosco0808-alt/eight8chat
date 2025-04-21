import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (session) {
    redirect("/chat");
  }
  if (!session) {
    return (
      <div className="container vh-100">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-12 text-center">
            <h1 className="display-4 mb-4">Eight8Chat</h1>

            <Link className="btn btn-primary btn-lg" href={"/api/auth/signin"}>
              Sign In With Email
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return <></>;
}
