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

export async function addFriend(userid: number, friendid: number) {
  // Check for invalid data
  // Thank you Copilot for the suggestion
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
