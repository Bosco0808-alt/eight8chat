"use client";
import { User } from "next-auth";
import Link from "next/link";

const MainContent = ({ user }: { user: User }) => {
  return (
    <div className="container mt-5 pt-5">
      <h1 className="d-flex justify-content-center mb-5 pb-5">
        Logged in as #{user?.id} ({user?.name})
      </h1>
      <div className="d-flex justify-content-center">
        <Link href="/chat/friends" className="btn btn-primary btn-lg mt-3">
          Start Chatting!
        </Link>
      </div>
    </div>
  );
};

export default MainContent;
