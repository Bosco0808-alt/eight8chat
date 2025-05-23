"use client";
import Link from "next/link";
import useWindowDimensions from "@/hooks/useWindowDimensions";

const NavbarProfileButton = ({
  name,
  email,
}: {
  name: string | null | undefined;
  email: string | null | undefined;
}) => {
  const { width, height } = useWindowDimensions();
  return (
    <li className="nav-item active">
      <Link className="nav-link" href="/chat/dashboard">
        👤 {width > 568 ? (name ? name : email) : null}
      </Link>
    </li>
  );
};

export default NavbarProfileButton;
