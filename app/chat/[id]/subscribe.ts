import { getMessages } from "@/actions";

async function subscribe(userId: number, friendId: number) {
  const unParsedResults = await getMessages(userId, friendId);
  const { result, messages, errMessage } = JSON.parse(unParsedResults);
  return { result, messages, errMessage };
}
