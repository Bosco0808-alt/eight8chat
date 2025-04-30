"use client";
import { rejectFriendRequest, addFriend } from "@/actions";
import Swal from "sweetalert2";

const ReceivedFriendRequest = ({
  id: id,
  senderId,
  senderName,
}: {
  id: string;
  senderId: number;
  senderName: string;
}) => {
  const handleRejectClick = async (requestId: string) => {
    // Handle reject click
    try {
      const unParsedResult = await rejectFriendRequest(requestId);
      const { result, message } = JSON.parse(unParsedResult);
      switch (result) {
        case "ERR_NO_REQUESTID":
          Swal.fire({
            title: "Error",
            text: "Request not found: invalid ID",
            icon: "error",
            timer: 3000,
          });
          break;
        case "ERR_NO_REQUEST":
          Swal.fire({
            title: "Error",
            text: "Request not found",
            icon: "error",
            timer: 3000,
          });
          break;
        case "ERR":
          Swal.fire({
            title: "Error",
            text: "An error occurred, try again later",
            icon: "error",
            timer: 3000,
          });
          console.error(message);
          break;
        case "SUCCESS":
          Swal.fire({
            title: "Success",
            text: "Friend request rejected",
            icon: "success",
            timer: 3000,
          });
          break;
        default:
          Swal.fire({
            title: "Error",
            text: "An error occurred, try again later",
            icon: "error",
            timer: 3000,
          });
          break;
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An error occurred, try again later",
        icon: "error",
        timer: 3000,
      });
      console.error("Error rejecting friend request:", error);
    }
  };
  const handleAcceptClick = async (requestId: string) => {
    // Handle accept click
    try {
      const unParsedResult = await addFriend(requestId);
      const { result, message } = JSON.parse(unParsedResult);
      switch (result) {
        case "ERR_NO_REQUESTID":
          Swal.fire({
            title: "Error",
            text: "Request not found: invalid ID",
            icon: "error",
            timer: 3000,
          });
          break;
        case "ERR_NO_REQUEST":
          Swal.fire({
            title: "Error",
            text: "Request not found",
            icon: "error",
            timer: 3000,
          });
          break;
        case "ERR_ALREADY_REJECTED":
          Swal.fire({
            title: "Error",
            text: "Request already rejected",
            icon: "error",
            timer: 3000,
          });
          break;
        case "ERR_ALREADY_FRIENDS":
          Swal.fire({
            title: "Error",
            text: "You are already friends",
            icon: "error",
            timer: 3000,
          });
          break;
        case "ERR":
          Swal.fire({
            title: "Error",
            text: "An error occurred, try again later",
            icon: "error",
            timer: 3000,
          });
          console.error(message);
          break;
        case "SUCCESS":
          Swal.fire({
            title: "Success",
            text: "Friend request accepted",
            icon: "success",
            timer: 3000,
          });
          break;
        default:
          Swal.fire({
            title: "Error",
            text: "An error occurred, try again later",
            icon: "error",
            timer: 3000,
          });
          break;
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An error occurred, try again later",
        icon: "error",
        timer: 3000,
      });
      console.error("Error accepting friend request:", error);
    }
  };
  return (
    <li>
      {senderId} {`(${senderName})`} sent you a friend request
      <button
        className="btn btn-primary m-2"
        onClick={() => handleAcceptClick(id)}
      >
        Accept
      </button>
      <button
        className="btn btn-danger m-2"
        onClick={() => handleRejectClick(id)}
      >
        Reject
      </button>
    </li>
  );
};

export default ReceivedFriendRequest;
