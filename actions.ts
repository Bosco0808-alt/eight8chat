"use server";
import prisma from "./lib/prisma";

export async function setName(displayName: string, userid: number) {
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
    const sentRequest = currentUser.sentRequests.find(
      (request) => request.receiverId === friendid
    );
    if (sentRequest) {
      return JSON.stringify({ result: "ERR_ALREADY_SENT_REQUEST" });
    }
    // Check if the friend has already sent a request
    const receivedRequest = currentUser.receivedRequests.find(
      (request) => request.senderId === friendid
    );
    if (receivedRequest) {
      return JSON.stringify({ result: "ERR_ALREADY_RECEIVED_REQUEST" });
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

export async function addFriend(userid: number, friendid: number) {
  // Check for invalid data
  const errors = {
    ERR_NO_USERID: !userid,
    ERR_NO_FRIENDID: !friendid,
    ERR_SAME_USER: userid === friendid,
    ERR_INVALID_USERID: userid < 0,
    ERR_INVALID_FRIENDID: friendid < 0,
  };

  for (const [error, condition] of Object.entries(errors)) {
    if (condition) {
      return JSON.stringify({ result: error });
    }
  }

  try {
    // Check if user and friend exist
    const currentUser = await prisma.users.findUnique({
      where: {
        id: userid,
      },
      include: {
        friends: true,
      },
    });
    if (!currentUser) {
      return JSON.stringify({ result: "ERR_NO_USER" });
    }
    const friend = await prisma.users.findUnique({
      where: {
        id: friendid,
      },
    });
    if (!friend) {
      return JSON.stringify({ result: "ERR_NO_FRIEND" });
    }
    // add friend to user
    await prisma.users.update({
      where: {
        id: userid,
      },
      data: {
        friends: {
          connect: {
            id: friendid,
          },
        },
      },
    });
    return JSON.stringify({ result: "SUCCESS" });
  } catch (err) {
    console.error(err);
    return JSON.stringify({ result: "ERR", message: err });
  }
}
