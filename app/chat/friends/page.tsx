import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import UnfriendButton from "./UnFriendButton";

const Friends = async () => {
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
  const { friends } = currentUser || { friends: [] };
  return (
    <>
      <h1>Friends</h1>
      {friends.length === 0 ? (
        <p>You have no friends yet.</p>
      ) : (
        <ul>
          {friends.map((friend) => (
            <li key={friend.id}>
              {friend.name || friend.email || "No Name"} (ID: {friend.id})
              <Link
                href={`/chat/${friend.id}`}
                className="btn btn-sm btn-primary m-2"
              >
                Chat with them!
              </Link>
              <UnfriendButton userId={userId} friendId={friend.id} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Friends;
