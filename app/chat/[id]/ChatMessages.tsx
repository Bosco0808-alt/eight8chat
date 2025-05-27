"use client";
import { useEffect, useState, useRef, Ref } from "react";
import styles from "./ChatMessages.module.scss";
import Swal from "sweetalert2";

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
              <span className="text-muted">
                {new Date(message.createdAt).toLocaleString()}
              </span>
              {message.sender.id === userId && (
                <button
                  className="btn btn-danger btn-sm mx-2"
                  onClick={() =>
                    Swal.fire({
                      title: "Delete Message",
                      text: "Are you sure you want to delete this message?",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText:
                        "No, I won't delete it because this button doesn't work yet",
                      cancelButtonText: "No, keep it",
                    })
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                  </svg>
                </button>
              )}
              <br />
              <p
                className={
                  message.sender.id === userId
                    ? styles.messageAuthorText
                    : "text-danger"
                }
              >
                {message.sender.name}
              </p>
              <p>{message.content}</p>
            </div>
          );
        })
      ) : (
        <p>No messages found.</p>
      )}
      {isLoading && <p>Loading...</p>}
      {isError && <p>An error occured, please try again later</p>}
    </div>
  );
};

export default ChatMessages;
