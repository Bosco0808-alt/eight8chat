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
        const newMessages = JSON.parse(event.data);
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
  return (
    <div style={{ overflowY: "scroll", height: "50vh" }} ref={scrollableRef}>
      {messages && messages.length > 0 ? (
        messages.map((message: any) => {
          return (
            <div
              key={message.id}
              className={`border p-2 m-2 rounded ${
                message.sender.id === userId
                  ? `${styles.messageBackground1}`
                  : ""
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
