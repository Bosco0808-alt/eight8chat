"use client";
import { User } from "next-auth";

const MainContent = ({ user }: { user: User }) => {
  return <>{user?.name}</>;
};

export default MainContent;
