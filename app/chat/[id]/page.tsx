import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

const ChattingInterface = async ({
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
    return <p>You are not friends with this user.</p>;
  }
  return (
    <>
      <h1>Chat with {friend.name || friend.email || "Unnamed user"}</h1>
      <form>
        <textarea className="form-control" />
        <button type="submit" className="btn btn-primary mt-2">
          Send (Doesn't work yet)
        </button>
      </form>
    </>
  );
};

export default ChattingInterface;
