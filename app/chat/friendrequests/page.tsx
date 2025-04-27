import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export default async function FriendRequests() {
  const session = await auth();
  const friendRequests = await prisma.friendRequests.findMany({
    where: {
      OR: [
        {
          senderId: Number(session?.user?.id),
        },
        {
          receiverId: Number(session?.user?.id),
        },
      ],
    },
    include: {
      receiver: {
        select: {
          name: true,
        },
      },
      sender: {
        select: {
          name: true,
        },
      },
    },
  });
  return (
    <>
      <h1>Friend Requests</h1>
      <p>Here you can manage your friend requests.</p>
      {/*friendRequests.length === 0 ? (
        <p>You have no friend requests.</p>
      ) : (
        <ul>
          {friendRequests.map((request) => (
            <li key={request.id}>
              {request.senderId === Number(session?.user?.id) ? (
                <>You sent a friend request to ${request.receiverId}</>
              ) : (
                <>{request.senderId} sent you a friend request</>
              )}
            </li>
          ))}
        </ul>
      )*/}
      <h3>Received friend requests</h3>
      {friendRequests.filter(
        (request) => request.receiverId === Number(session?.user?.id)
      ).length === 0 ? (
        <p>You have no received friend requests.</p>
      ) : (
        <ul>
          {friendRequests
            .filter(
              (request) => request.receiverId === Number(session?.user?.id)
            )
            .map((request) => (
              <li key={request.id}>
                {request.senderId} {`(${request.sender.name})`} sent you a
                friend request
                <button className="btn btn-primary m-2">Accept</button>
                <button className="btn btn-danger m-2">Reject</button>
              </li>
            ))}
        </ul>
      )}
      <h3>Sent friend requests</h3>
      {friendRequests.filter(
        (request) => request.senderId === Number(session?.user?.id)
      ).length === 0 ? (
        <p>You have no sent friend requests.</p>
      ) : (
        <ul>
          {friendRequests
            .filter((request) => request.senderId === Number(session?.user?.id))
            .map((request) => (
              <li key={request.id}>
                You sent a friend request to {request.receiverId}
                {` (${request.receiver.name})`}
              </li>
            ))}
        </ul>
      )}
    </>
  );
}
