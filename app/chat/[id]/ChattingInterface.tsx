"use client";
import { useState } from "react";
import { sendMessage } from "@/actions";
import Swal from "sweetalert2";

const ChattingInterface = ({
  senderId,
  receiverId,
}: {
  senderId: number;
  receiverId: number;
}) => {
  const [pendingMessage, setPendingMessage] = useState(""); // bound to the textarea
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pendingMessage.trim() === "") {
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter a non-empty message.",
      });
    }
    setPendingMessage("");
    try {
      const response = await sendMessage(senderId, receiverId, pendingMessage);
      const { result, message } = JSON.parse(response);
      switch (result) {
        case "ERR_NO_SENDERID_OR_RECEIVERID":
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Sender ID or Receiver ID is missing.",
          });
          break;
        case "ERR_SAME_USER":
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "You cannot send a message to yourself.",
          });
          break;
        case "ERR_INVALID_SENDERID_OR_RECEIVERID":
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Invalid Sender ID or Receiver ID.",
          });
          break;
        case "ERR_NOT_FRIENDS":
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "You are not friends with this user.",
          });
          break;
        case "ERR_NO_MESSAGE":
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Message is empty.",
          });
          break;
        case "ERR_NO_SENDER_OR_RECEIVER":
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Sender or Receiver not found.",
          });
          break;
        case "ERR":
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An error occurred while sending the message.",
          });
          console.error("Error:", message);
          break;
        case "ERR_NOT_AUTHENTICATED":
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "You are not authenticated.",
          });
          break;
        case "SUCCESS":
          // We actually don't need to do anything here this is just an exception for the default case
          console.log("Message sent successfully:", message); // debug purposes
          break;
        default:
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An unexpected error occurred.",
          });
          console.error("Unexpected result:", result, message);
          break;
      }
    } catch (error) {
      console.error("Error sending message:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to send message.",
      });
    } finally {
      setPendingMessage("");
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <textarea
          className="form-control"
          onChange={(e) => setPendingMessage(e.target.value)}
          value={pendingMessage}
        />
        <button type="submit" className="btn btn-primary mt-2">
          Send (Doesn't work yet)
        </button>
      </form>
    </>
  );
};

export default ChattingInterface;
