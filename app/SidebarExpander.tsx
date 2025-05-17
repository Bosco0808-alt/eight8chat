"use client";

import { isOpenAtom } from "@/atoms";
import { useAtom } from "jotai";
import Image from "next/image";
import Menu from "@/public/menu.svg";
import styles from "./SidebarExpander.module.scss";

const SidebarExpander = () => {
  const [isOpen, setIsOpen] = useAtom(isOpenAtom);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <button
      className={`btn d-md-none m-2 ${styles.coloredSidebarExpander}`}
      type="button"
      onClick={toggleSidebar}
      aria-controls="sidebar"
      aria-expanded={isOpen}
      aria-label="Toggle navigation"
    >
      <Image src={Menu} width={15} height={20} alt="Navbar toggler" />
    </button>
  );
};

export default SidebarExpander;
