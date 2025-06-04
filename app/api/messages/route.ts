import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const session = await auth();
    const url = new URL(request.url);
    const userid = url.searchParams.get("userid");
    const friendid = url.searchParams.get("friendid");
    // connection checks
    if (Number(userid) !== Number(session?.user?.id)) {
        return new Response("Unauthorized", { status: 401 });
    }

    const user = await prisma.users.findUnique({
        where: { id: Number(userid) },
        include: { friends: true },
    });
    const friend = await prisma.users.findUnique({
        where: { id: Number(friendid) },
    });

    if (!user || !friend) {
        return new Response("Not found", { status: 404 });
    }

    if (!user.friends.find((f) => f.id === friend.id)) {
        return new Response("Forbidden", { status: 403 });
    }

    const stream = new TransformStream({
        transform(chunk, controller) {
            controller.enqueue(`data: ${JSON.stringify(chunk)}\n\n`);
        },
    });

    const writer = stream.writable.getWriter();
    let prevMessages: any[] = [];
    await writer.write([]);
    const intervalId = setInterval(() => {
        async function getMessages() {
            try {
                // Run a simple query to check the connection
                await prisma.$queryRaw`SELECT 1`;
            } catch (error) {
                await prisma.$connect();
            }
            const messages = await prisma.messages.findMany({
                where: {
                    OR: [
                        {
                            senderId: Number(userid),
                            receiverId: Number(friendid),
                        },
                        {
                            senderId: Number(friendid),
                            receiverId: Number(userid),
                        },
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
            let isClosed = false;
            writer.closed.then(() => {
                isClosed = true;
            });
            if (isClosed) {
                return;
            }
            if (JSON.stringify(messages) !== JSON.stringify(prevMessages)) {
                prevMessages = [...messages];
                await writer.write(messages);
            }
        }
        getMessages();
    }, 1000);
    request.signal.addEventListener("abort", () => {
        clearInterval(intervalId);
        writer.close();
    });

    return new Response(stream.readable, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}
