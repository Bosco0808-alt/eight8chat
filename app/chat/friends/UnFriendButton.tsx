"use client";
import { useAtom } from "jotai";
import { isDarkModeAtom } from "@/atoms";
import Swal from "sweetalert2";
import { unFriend } from "@/actions";
import { useRouter } from "next/navigation";

const UnfriendButton = ({
  userId,
  friendId,
}: {
  userId: number;
  friendId: number;
}) => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useAtom(isDarkModeAtom);
  const handleClick = async () => {
    const result = await Swal.fire({
      title: "Confirmation",
      text: "Are you sure you want to unfriend this user?",
      icon: "info",
      theme: isDarkMode ? "dark" : "light",
      confirmButtonText: "Yes, I am sure",
      showCancelButton: true,
    });
    if (!result.isConfirmed) {
      return;
    }
    try {
      const unParsedResult = await unFriend(userId, friendId);
      const { result, errMessage } = JSON.parse(unParsedResult);
      switch (result) {
        case "ERR_NO_USERID_OR_FRIENDID":
          Swal.fire({
            title: "Error",
            text: "There was an error processing your request. Please try again later.",
            icon: "error",
            theme: isDarkMode ? "dark" : "light",
          });
          break;
        case "ERR_SAME_USER":
          Swal.fire({
            title: "Error",
            text: "You cannot unfriend yourself.",
            icon: "error",
            theme: isDarkMode ? "dark" : "light",
          });
          break;
        case "ERR_INVALID_USERID_OR_FRIENDID":
          Swal.fire({
            title: "Error",
            text: "Invalid user ID or friend ID.",
            icon: "error",
            theme: isDarkMode ? "dark" : "light",
          });
          break;
        case "ERR_NOT_AUTHENTICATED":
          Swal.fire({
            title: "Error",
            text: "You are not authenticated. Please log in again.",
            icon: "error",
            theme: isDarkMode ? "dark" : "light",
          });
          break;
        case "ERR_NO_USER":
          Swal.fire({
            title: "Error",
            text: "User not found. Please try again later.",
            icon: "error",
            theme: isDarkMode ? "dark" : "light",
          });
          break;
        case "ERR_NO_FRIEND":
          Swal.fire({
            title: "Error",
            text: "Friend not found. Please try again later.",
            icon: "error",
            theme: isDarkMode ? "dark" : "light",
          });
          break;
        case "SUCCESS":
          Swal.fire({
            title: "Success",
            text: "You have successfully unfriended the user.",
            icon: "success",
            theme: isDarkMode ? "dark" : "light",
          });
          router.refresh();
          break;
        case "ERR":
          Swal.fire({
            title: "Error",
            text: "An unknown error occurred. Please try again later.",
            icon: "error",
            theme: isDarkMode ? "dark" : "light",
          });
          break;
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "An unexpected error occurred. Please try again later.",
        icon: "error",
        theme: isDarkMode ? "dark" : "light",
      });
      console.error("Error in UnfriendButton:", err);
    }
  };
  return (
    <button className="btn btn-sm btn-danger m-2" onClick={handleClick}>
      Unfriend
    </button>
  );
};

export default UnfriendButton;
