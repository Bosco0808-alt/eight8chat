import { auth } from "@/lib/auth";
import Link from "next/link";
import SidebarExpander from "./SidebarExpander";
import styles from "@/app/Navbar.module.scss";
import ColorThemeTogglerWrapper from "./ColorThemeTogglerWrapper";
import NavbarProfileButton from "./NavbarProfileButton";

const Navbar = async () => {
  const session = await auth();
  return (
    <nav className={`navbar navbar-expand ${styles.coloredNavbar} fixed-top`}>
      {session && <SidebarExpander />}
      <ColorThemeTogglerWrapper />
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
          <NavbarProfileButton
            name={session?.user?.name}
            email={session?.user?.email}
          />
        )}
      </ul>
    </nav>
  );
};
export default Navbar;
