import { auth } from "@/lib/auth";
import Link from "next/link";
import SidebarExpander from "./SidebarExpander";

const Navbar = async () => {
  const session = await auth();
  return (
    <nav className="navbar navbar-expand navbar-light bg-light">
      {session && <SidebarExpander />}
      <Link href={session ? "/chat" : "/"} className="navbar-brand m-2">
        Home
      </Link>
      <ul className="navbar-nav">
        {session ? (
          <li className="nav-item active">
            <Link className="nav-link" href="/api/auth/signout">
              Sign Out
            </Link>
          </li>
        ) : (
          <li className="nav-item active">
            <Link className="nav-link" href="/api/auth/signin">
              Sign In
            </Link>
          </li>
        )}
        {session && (
          <li className="nav-item active">
            <Link className="nav-link" href="/chat/dashboard">
              👤{" "}
              {session?.user?.name ? session?.user?.name : session?.user?.email}
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};
export default Navbar;
