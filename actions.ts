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
    return JSON.stringify({ result: "ERR" });
  }
}
