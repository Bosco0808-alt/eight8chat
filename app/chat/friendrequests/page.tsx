import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import ReceivedFriendRequest from "./ReceivedFriendRequest";

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
          email: true,
        },
      },
    },
  });
  return (
    <>
      <h1>Friend Requests</h1>
      <p>Here you can manage your friend requests.</p>

      <h3>Received friend requests</h3>
      {friendRequests.filter(
        (request) =>
          request.receiverId === Number(session?.user?.id) &&
          request.status === "PENDING"
      ).length === 0 ? (
        <p>You have no received friend requests.</p>
      ) : (
        <ul>
          {friendRequests
            .filter(
              (request) => request.receiverId === Number(session?.user?.id)
            )
            .map((request) =>
              request.status === "REJECTED" ? null : (
                <ReceivedFriendRequest
                  key={request.id}
                  id={request.id}
                  senderId={request.senderId}
                  senderName={
                    request.sender.name || request.sender.email || "No Name"
                  }
                />
              )
            )}
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
                {` (${request.receiver.name}) `}
                <span
                  className={
                    request.status === "REJECTED"
                      ? "badge bg-danger"
                      : request.status === "ACCEPTED"
                      ? "badge bg-success"
                      : "badge bg-warning"
                  }
                >
                  {request.status.replace(
                    request.status,
                    (status) =>
                      status.charAt(0).toUpperCase() +
                      status.slice(1).toLowerCase()
                  )}
                </span>
              </li>
            ))}
        </ul>
      )}
    </>
  );
}
