"use server";
import prisma from "./lib/prisma";
import { auth } from "./lib/auth";

async function getUser() {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("User is not authenticated");
    }
    return session;
} // for authentication

export async function setName(displayName: string, userid: number) {
    // Check for invalid data
    if (!displayName) {
        return JSON.stringify({ result: "ERR_NO_DISPLAYNAME" });
    }
    try {
        const session = await getUser();
        // console.log("session", session);
        if (Number(session?.user?.id) !== userid) {
            return JSON.stringify({ result: "ERR_NOT_AUTHENTICATED" });
        }
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
        const session = await getUser();
        if (Number(session?.user?.id) !== userid) {
            return JSON.stringify({ result: "ERR_NOT_AUTHENTICATED" });
        }
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
                return JSON.stringify({
                    result: "ERR_ALREADY_RECEIVED_REQUEST",
                });
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
        // Check if the user is authenticated
        const session = await getUser();
        if (Number(session?.user?.id) !== request.receiverId) {
            return JSON.stringify({ result: "ERR_NOT_AUTHENTICATED" });
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
            senderFriends?.friends.some(
                (friend) => friend.id === receiver.id
            ) ||
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
        // Check if the user is authenticated
        const session = await getUser();
        if (Number(session?.user?.id) !== request.receiverId) {
            return JSON.stringify({ result: "ERR_NOT_AUTHENTICATED" });
        }
        // Reject the request
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

export async function sendMessage(
    senderId: number,
    receiverId: number,
    message: string
): Promise<string> {
    if (!senderId || !receiverId) {
        return JSON.stringify({ result: "ERR_NO_SENDERID_OR_RECEIVERID" });
    }
    if (senderId === receiverId) {
        return JSON.stringify({ result: "ERR_SAME_USER" });
    }
    if (senderId < 0 || receiverId < 0) {
        return JSON.stringify({ result: "ERR_INVALID_SENDERID_OR_RECEIVERID" });
    }
    if (!message) {
        return JSON.stringify({ result: "ERR_NO_MESSAGE" });
    }
    try {
        // Check if the user is authenticated

        const session = await getUser();
        if (Number(session?.user?.id) !== senderId) {
            return JSON.stringify({ result: "ERR_NOT_AUTHENTICATED" });
        }

        // Check if the sender and receiver exist
        const sender = await prisma.users.findUnique({
            where: {
                id: Number(senderId),
            },
        });
        const receiver = await prisma.users.findUnique({
            where: {
                id: Number(receiverId),
            },
        });
        if (!sender || !receiver) {
            return JSON.stringify({ result: "ERR_NO_SENDER_OR_RECEIVER" });
        }
        // Check if they are friends
        const senderFriends = await prisma.users.findUnique({
            where: {
                id: Number(senderId),
            },
            include: {
                friends: true,
            },
        });
        if (
            !senderFriends?.friends.some((friend) => friend.id === receiver.id)
        ) {
            return JSON.stringify({ result: "ERR_NOT_FRIENDS" });
        }
        await prisma.messages.create({
            data: {
                senderId: Number(senderId),
                receiverId: Number(receiverId),
                content: message,
            },
        });
        return JSON.stringify({ result: "SUCCESS" });
    } catch (err) {
        console.error(err);
        return JSON.stringify({
            result: "ERR",
            message: err instanceof Error ? err.message : String(err),
        });
    }
}

// The fact that this thing's sole purpose is for the subscribe function:
export async function getMessages(
    userId: number,
    friendId: number
): Promise<string> {
    if (!userId || !friendId) {
        return JSON.stringify({ result: "ERR_NO_SENDERID_OR_RECEIVERID" });
    }
    if (userId === friendId) {
        return JSON.stringify({ result: "ERR_SAME_USER" });
    }
    try {
        // Check if the user is authenticated
        const session = await getUser();
        if (Number(session?.user?.id) !== Number(userId)) {
            return JSON.stringify({ result: "ERR_NOT_AUTHENTICATED" });
        }
        // Check if the sender and receiver exist
        const sender = await prisma.users.findUnique({
            where: {
                id: Number(userId),
            },
        });
        const receiver = await prisma.users.findUnique({
            where: {
                id: Number(friendId),
            },
        });
        if (!sender || !receiver) {
            return JSON.stringify({ result: "ERR_NO_SENDER_OR_RECEIVER" });
        }
        // Check if they are friends
        const senderFriends = await prisma.users.findUnique({
            where: {
                id: Number(userId),
            },
            include: {
                friends: true,
            },
        });
        const receiverFriends = await prisma.users.findUnique({
            where: {
                id: Number(friendId),
            },
            include: {
                friends: true,
            },
        });
        if (
            !senderFriends?.friends.some(
                (friend) => friend.id === receiver.id
            ) ||
            !receiverFriends?.friends.some((friend) => friend.id === sender.id)
        ) {
            return JSON.stringify({ result: "ERR_NOT_FRIENDS" });
        }
        // Get messages
        const messages = await prisma.messages.findMany({
            where: {
                OR: [
                    { senderId: Number(userId), receiverId: Number(friendId) },
                    { senderId: Number(friendId), receiverId: Number(userId) },
                ],
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "asc",
            },
        });
        return JSON.stringify({ result: "SUCCESS", messages });
    } catch (err) {
        console.error(err);
        return JSON.stringify({ result: "ERR", errMessage: err });
    }
}

export async function changeColorMode(
    userId: number,
    mode: string
): Promise<string> {
    if (!userId) {
        return JSON.stringify({ result: "ERR_NO_USERID" });
    }
    const session = await getUser();
    if (Number(session?.user?.id) !== userId) {
        return JSON.stringify({ result: "ERR_NOT_AUTHENTICATED" });
    }
    try {
        const currentUser = await prisma.users.findUnique({
            where: {
                id: userId,
            },
        });
        await prisma.users.update({
            where: {
                id: userId,
            },
            data: {
                preferedColorMode: mode,
            },
        });
        return JSON.stringify({ result: "SUCCESS" });
    } catch (err) {
        console.error(err);
        return JSON.stringify({ result: "ERR", errMessage: err });
    }
}
