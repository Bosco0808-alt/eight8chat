import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

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
              <button className="btn btn-sm btn-primary m-2">
                Chat with them!
              </button>
              <button className="btn btn-sm btn-danger m-2">Unfriend</button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Friends;
