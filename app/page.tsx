import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Eight8Chat</h1>
      <Link
        href="/signup"
        className={`btn btn-primary btn-lg ${styles.signupbutton} grid-item`}
      >
        Sign Up
      </Link>
      <Link
        href="/signin"
        className={`btn btn-secondary btn-lg ${styles.signinbutton} grid-item`}
      >
        Sign In
      </Link>
    </div>
  );
}
