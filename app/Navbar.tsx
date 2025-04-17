import { auth } from "@/lib/auth";
import Link from "next/link";

const Navbar = async () => {
  const session = await auth();
  return (
    <nav className="navbar navbar-expand navbar-light bg-light">
      <Link href="/" className="navbar-brand m-2">
        Home
      </Link>
      <ul className="navbar-nav">
        {session ? (
          <li className="nav-item active">
            <Link className="nav-link btn btn-danger" href="/api/auth/signout">
              Logout
            </Link>
          </li>
        ) : (
          <li className="nav-item active">
            <Link className="nav-link" href="/api/auth/signin">
              Log In
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};
export default Navbar;
