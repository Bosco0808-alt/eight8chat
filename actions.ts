"use server";
import prisma from "./lib/prisma";

export async function setName(displayName: string, userid: number) {
  // Check for invalid data
  if (!displayName) {
    return JSON.stringify({ result: "ERR_NO_DISPLAYNAME" });
  }
  try {
    await prisma.users.update({
      where: {
        id: userid,
      },
      data: {
        name: displayName,
      },
    });
    return JSON.stringify({ result: "SUCCESS" });
  } catch (err) {
    console.error(err);
    return JSON.stringify({ result: "ERR", message: err });
  }
}

export async function addFriendRequest(userid: number, friendid: number) {
  // Check if userid and friendid exist
  if (!userid || !friendid) {
    return JSON.stringify({ result: "ERR_NO_USERID_OR_FRIENDID" });
  }
  if (userid === friendid) {
    return JSON.stringify({ result: "ERR_SAME_USER" });
  }
  if (userid < 0 || friendid < 0) {
    return JSON.stringify({ result: "ERR_INVALID_USERID_OR_FRIENDID" });
  }
  try {
    // Check for invalid data

    // Check if user and friend exist

    // User
    const currentUser = await prisma.users.findUnique({
      where: {
        id: userid,
      },
      include: {
        sentRequests: true,
        receivedRequests: true,
        friends: true,
      },
    });
    if (!currentUser) {
      return JSON.stringify({ result: "ERR_NO_USER" });
    }

    // Friend
    const friend = await prisma.users.findUnique({
      where: {
        id: friendid,
      },
    });
    if (!friend) {
      return JSON.stringify({ result: "ERR_NO_FRIEND" });
    }

    // Check if a request has already been sent
    const sentRequests = currentUser.sentRequests.filter(
      (request) => request.receiverId === friendid
    );
    for (const request of sentRequests) {
      if (request.status === "PENDING") {
        return JSON.stringify({ result: "ERR_ALREADY_SENT_REQUEST" });
      }
    }
    // Check if the friend has already sent a request
    const receivedRequest = currentUser.receivedRequests.filter(
      (request) => request.senderId === friendid
    );
    for (const request of receivedRequest) {
      if (request.status === "PENDING") {
        return JSON.stringify({ result: "ERR_ALREADY_RECEIVED_REQUEST" });
      }
    }
    // Check if the user is already friends with the friend
    const isFriend = currentUser.friends.find(
      (friend) => friend.id === friendid
    );

    if (isFriend) {
      return JSON.stringify({ result: "ERR_ALREADY_FRIENDS" });
    }
    // Create a friend request
    await prisma.friendRequests.create({
      data: { senderId: userid, receiverId: friendid },
    });
    return JSON.stringify({ result: "SUCCESS" });
  } catch (err) {
    console.error(err);
    return JSON.stringify({ result: "ERR", message: err });
  }
}

export async function addFriend(requestId: string) {
  // Check for invalid data
  const errors = {
    ERR_NO_REQUESTID: !requestId,
  };

  for (const [error, condition] of Object.entries(errors)) {
    if (condition) {
      return JSON.stringify({ result: error });
    }
  }
  /* If you are wondering why i am using a for loop even though i can just use an if statement, it is because i am lazy and i want to add more errors in the future without having to write a lot of code.
   * In fact, the previous sentence was written by an AI.
   */
  try {
    // Check if the request exists
    const request = await prisma.friendRequests.findUnique({
      where: {
        id: requestId,
      },
      include: {
        sender: true,
        receiver: true,
      },
    });
    if (!request || !request.sender || !request.receiver) {
      return JSON.stringify({ result: "ERR_NO_REQUEST" });
    }
    // Check if the request is already rejected
    if (request.status === "REJECTED") {
      return JSON.stringify({ result: "ERR_ALREADY_REJECTED" });
    }
    // Check if they are already friends
    const { sender, receiver } = request;
    const senderFriends = await prisma.users.findUnique({
      where: {
        id: sender.id,
      },
      include: {
        friends: true,
      },
    });
    const receiverFriends = await prisma.users.findUnique({
      where: {
        id: receiver.id,
      },
      include: {
        friends: true,
      },
    });
    if (
      senderFriends?.friends.some((friend) => friend.id === receiver.id) ||
      receiverFriends?.friends.some((friend) => friend.id === sender.id)
    ) {
      return JSON.stringify({ result: "ERR_ALREADY_FRIENDS" });
    }
    // Add friend to user
    await prisma.users.update({
      where: {
        id: request.receiverId,
      },
      data: {
        friends: {
          connect: {
            id: request.senderId,
          },
        },
      },
    });
    // Add friend to user
    await prisma.users.update({
      where: {
        id: request.senderId,
      },
      data: {
        friends: {
          connect: {
            id: request.receiverId,
          },
        },
      },
    });
    // Set the status of the request to accepted
    await prisma.friendRequests.update({
      where: {
        id: requestId,
      },
      data: {
        status: "ACCEPTED",
      },
    });
    return JSON.stringify({ result: "SUCCESS" });
  } catch (err) {
    console.error(err);
    return JSON.stringify({ result: "ERR", message: err });
  }
}

export async function rejectFriendRequest(requestId: string) {
  if (!requestId) {
    return JSON.stringify({ result: "ERR_NO_REQUESTID" });
  }
  try {
    // Check if the request exists
    const request = await prisma.friendRequests.findUnique({
      where: {
        id: requestId,
      },
      include: {
        sender: true,
        receiver: true,
      },
    });
    if (!request || !request.sender || !request.receiver) {
      return JSON.stringify({ result: "ERR_NO_REQUEST" });
    }
    // Delete the request
    await prisma.friendRequests.update({
      where: {
        id: request.id,
      },
      data: {
        status: "REJECTED",
      },
    });
    return JSON.stringify({ result: "SUCCESS" });
  } catch (err) {
    console.error(err);
    return JSON.stringify({ result: "ERR", message: err });
  }
}
