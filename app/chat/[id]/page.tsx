import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import ChattingInterface from "./ChattingInterface";
import Link from "next/link";

const ChattingInterfaceWrapper = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const session = await auth();
  const userId = Number(session?.user?.id);
  const currentUser = await prisma.users.findUnique({
    where: {
      id: userId,
    },
    include: {
      friends: true,
    },
  });
  const chatInterface = await params;
  const { id } = chatInterface;
  const friend = currentUser?.friends.find(
    (friend) => friend.id === Number(id)
  );
  if (!friend) {
    return (
      <>
        <h1>You are not friends with this user.</h1>
        <Link href="/chat">
          <button className="btn btn-primary">Go back to chat</button>
        </Link>
      </>
    );
  }
  return (
    <>
      <h1>Chat with {friend.name || friend.email || "Unnamed user"}</h1>
      <ChattingInterface
        senderId={currentUser?.id ?? Number(session?.user?.id)}
        receiverId={friend.id}
      />
      {/* DONT SWAP THE PROPS */}
    </>
  );
};

export default ChattingInterfaceWrapper;
