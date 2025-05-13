"use client";
import { useEffect, useState, useRef, Ref } from "react";
import styles from "./ChatMessages.module.scss";

const ChatMessages = ({
  userId,
  friendId,
}: {
  userId: number;
  friendId: number;
}) => {
  // all of da state
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  // refs
  const scrollableRef: Ref<any> = useRef(null);
  // effects
  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
    }
  }, [messages]);
  useEffect(() => {
    function initES() {
      const eventSource = new EventSource(
        `/api/messages?userid=${userId}&friendid=${friendId}`
      );
      // sse
      eventSource.onmessage = (event) => {
        const newMessages = JSON.parse(JSON.parse(event.data)); // this works don't remove double parsing future devs
        // 👆 I know my code 😎 --- Bosco0808alt-2
        // console.log(newMessages);
        // console.log(typeof newMessages);
        setMessages(JSON.parse(JSON.stringify(newMessages)));
        // console.log("messages: " + messages);
        setIsLoading(false);
        setIsError(false);
      };

      eventSource.onerror = (error) => {
        console.error("EventSource failed:", error);
        setIsLoading(false);
        setIsError(true);
        if (eventSource.readyState === 2) {
          eventSource.close();
          setTimeout(initES, 5000);
        }
      };

      // Clean up on component unmount
      return () => {
        eventSource.close();
      };
    }
    initES();
  }, [userId, friendId]);
  /*
  useEffect(() => {
    async function subscribe(userId: number, friendId: number) {
      const unParsedResults = await getMessages(userId, friendId);
      const { result, messages, errMessage } = JSON.parse(unParsedResults);
      switch (result) {
        case "ERR_NO_SENDERID_OR_RECEIVERID":
          setIsLoading(false);
          setIsError(true);
          setErrMessage("Sender ID or Receiver ID is missing.");
          break;
        case "ERR_SAME_USER":
          setIsLoading(false);
          setIsError(true);
          setErrMessage("You cannot send a message to yourself.");
          break;
        case "ERR_INVALID_SENDERID_OR_RECEIVERID":
          setIsLoading(false);
          setIsError(true);
          setErrMessage("Invalid Sender ID or Receiver ID.");
          break;
        case "ERR_NOT_FRIENDS":
          setIsLoading(false);
          setIsError(true);
          setErrMessage("You are not friends with this user.");
          break;
        case "ERR_NOT_AUTHENTICATED":
          setIsLoading(false);
          setIsError(true);
          setErrMessage("You are not authenticated.");
          break;
        case "SUCCESS":
          setIsLoading(false);
          setMessages(messages);
          setResult(result);
          setIsError(false);
          setErrMessage("");
          break;
        case "ERR":
          setIsLoading(false);
          setIsError(true);
          console.log(errMessage);
          setErrMessage("An error occurred while receiving the messages.");
          break;
        default:
          setIsLoading(false);
          setIsError(true);
          setErrMessage("An error occurred while receiving the messages.");
          console.log(errMessage);
          break;
      }
    }
    setInterval(() => {
      subscribe(userId, friendId);
    }, 1000); // short polling replacing long polling(for now)
    // TODO: replace with long polling that actually scales and not recursively spam requests to server
    subscribe(userId, friendId); // Will recursively call itself for new messages(long polling)
  }, []);
  */
  return (
    <div style={{ overflowY: "scroll", height: "50vh" }} ref={scrollableRef}>
      {messages && messages.length > 0 ? (
        messages.map((message: any) => {
          return (
            <div
              key={message.id}
              className={`border p-2 m-2 rounded ${
                message.sender.id === userId
                  ? `${styles.messageBackground1} bg-gradient`
                  : "bg-light bg-gradient"
              }`}
            >
              <p className="text-muted">
                {new Date(message.createdAt).toLocaleString()}
              </p>
              <p
                className={
                  message.sender.id === userId ? "text-white" : "text-danger"
                }
              >
                {message.sender.name}
              </p>
              <p>{message.content}</p>
            </div>
          );
        })
      ) : isLoading ? null : (
        <p>No messages found.</p>
      )}
      {isLoading && <p>Loading...</p>}
      {isError && <p>An error occured, please try again later</p>}
    </div>
  );
};

export default ChatMessages;
