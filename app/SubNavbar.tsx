"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const SubNavbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  useEffect(() => {
    const cookieValue = Cookies.get("subnavbar");
    if (cookieValue === "collapsed") {
      setIsCollapsed(true);
    }
  });
  if (isCollapsed) {
    return null;
  }
  return (
    <nav className="text-center py-3" style={{ backgroundColor: "#F0FFFF" }}>
      <span>
        Eight8chat is still under active development and it will be functional
        by the start of 2026
      </span>
      <button
        className="btn"
        style={{ backgroundColor: "#F0FFFF" }}
        onClick={() => {
          setIsCollapsed(true);
          Cookies.set("subnavbar", "collapsed", { expires: 1 / 24 }); // Set cookie to expire in 1 hour
        }}
      >
        ×
      </button>
    </nav>
  );
};

export default SubNavbar;
