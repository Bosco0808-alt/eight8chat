import Link from "next/link";
import styles from "./page.module.css";
import { signIn } from "@/lib/auth";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (session) {
    redirect("/chat");
  }
  if (!session) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Eight8Chat</h1>
        <form
          className={styles.form}
          action={async () => {
            "use server";
            await signIn(/*"resend", { redirectTo: "/chat" }*/);
          }}
        >
          {/*<button className={`btn btn-primary btn-lg ${styles.signupbutton} m-4`}>
          Sign Up
        </button>*/}
          <button
            className={`btn btn-secondary btn-lg grid-item ${styles.signinbutton} m-4`}
            type="submit"
          >
            Sign In With Email
          </button>
        </form>
      </div>
    );
  }
  return <></>;
}
