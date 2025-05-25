"use client";
import { useAtom } from "jotai";
import { isDarkModeAtom, isOpenAtom } from "@/atoms";
import Swal from "sweetalert2";
import { addFriendRequest } from "@/actions";
import Link from "next/link";
import styles from "./Sidebar.module.scss";
const Sidebar = ({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: number | undefined | null;
}) => {
  const [isOpen, setIsOpen] = useAtom(isOpenAtom); // For responsive sidebar
  const [isDarkMode, setIsDarkMode] = useAtom(isDarkModeAtom);
  const handleClick = async () => {
    // Add friend
    const result = await Swal.fire({
      theme: isDarkMode ? "dark" : "light",
      title: "Add friend",
      text: "Enter friend ID",
      icon: "info",
      input: "number",
      inputAttributes: {
        autocapitalize: "off",
      },
      confirmButtonText: "Add friend",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      inputValidator(value) {
        if (!value || Number(value) < 1) {
          return "Please enter a valid ID";
        }
      },
    });
    const { value: friendID } = result;
    if (!result.isConfirmed) {
      return;
    }
    // console.log(friendID);
    const unParsedResult = userId
      ? await addFriendRequest(userId, Number(friendID))
      : null;
    if (unParsedResult === null) {
      return Swal.fire({
        title: "Error",
        text: "There was an error, please try again later",
        icon: "error",
        timer: 3000,
      });
    }
    const { result: actionResult, message } = JSON.parse(unParsedResult);
    if (message) {
      console.error(message);
    }
    // Check for errors
    switch (actionResult) {
      case "ERR_NO_USERID_OR_FRIENDID":
        Swal.fire({
          title: "Error",
          text: "Please enter a valid ID",
          icon: "error",
          timer: 3000,
          theme: isDarkMode ? "dark" : "light",
        });
        break;
      case "ERR_SAME_USER":
        Swal.fire({
          title: "Error",
          text: "You cannot add yourself as a friend",
          icon: "error",
          timer: 3000,
          theme: isDarkMode ? "dark" : "light",
        });
        break;
      case "ERR_INVALID_USERID_OR_FRIENDID":
        Swal.fire({
          title: "Error",
          text: "Please enter a valid ID",
          icon: "error",
          timer: 3000,
          theme: isDarkMode ? "dark" : "light",
        });
        break;
      case "ERR_NO_USER":
        Swal.fire({
          title: "Error",
          text: "User not found",
          icon: "error",
          timer: 3000,
          theme: isDarkMode ? "dark" : "light",
        });
        break;
      case "ERR_NO_FRIEND":
        Swal.fire({
          title: "Error",
          text: "Friend not found",
          icon: "error",
          timer: 3000,
          theme: isDarkMode ? "dark" : "light",
        });
        break;
      case "ERR_ALREADY_FRIENDS":
        Swal.fire({
          title: "Error",
          text: "You are already friends with this user",
          icon: "error",
          timer: 3000,
          theme: isDarkMode ? "dark" : "light",
        });
        break;
      case "ERR_ALREADY_SENT_REQUEST":
        Swal.fire({
          title: "Error",
          text: "You have already sent a friend request to this user",
          icon: "error",
          timer: 3000,
          theme: isDarkMode ? "dark" : "light",
        });
        break;
      case "ERR_ALREADY_RECEIVED_REQUEST":
        Swal.fire({
          title: "Error",
          text: "You have already received a friend request from this user",
          icon: "error",
          timer: 3000,
          theme: isDarkMode ? "dark" : "light",
        });
        break;
      case "ERR":
        Swal.fire({
          title: "Error",
          text: "There was an error, please try again later",
          icon: "error",
          timer: 3000,
          theme: isDarkMode ? "dark" : "light",
        });
        break;
      // End of error checking
      case "SUCCESS":
        Swal.fire({
          title: "Success",
          text: "Friend request sent successfully",
          icon: "success",
          timer: 3000,
          theme: isDarkMode ? "dark" : "light",
        });
        break;
      default:
        Swal.fire({
          title: "Error",
          text: "There was an error, please try again later",
          icon: "error",
          timer: 3000,
          theme: isDarkMode ? "dark" : "light",
        });
        break;
    }
    // End of switch case just in case of this code is too unreadable
  };
  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        <nav
          className={`col-md-2 ${styles.sidebar} ${
            isOpen ? "d-flex" : "d-none d-md-flex"
          } flex-column align-items-center`}
        >
          <h2 className="p-3">Friends</h2>
          <button className="btn btn-primary" onClick={handleClick}>
            + Add New Friend
          </button>
          <button
            className={`btn mt-2 text-white btn btn-secondary`}
            onClick={() => setIsOpen(false)}
          >
            <Link
              href="/chat/friendrequests"
              className="text-white"
              style={{ textDecoration: "none" }}
            >
              Check Friend Requests
            </Link>
          </button>
          <button
            className={`btn mt-2 ${styles.mediumSeaGreen} text-white`}
            onClick={() => setIsOpen(false)}
          >
            <Link
              href="/chat/friends"
              className="text-white"
              style={{ textDecoration: "none" }}
            >
              Manage and check friends
            </Link>
          </button>
        </nav>
        <main
          className={`col-12 col-md-9 ${
            isOpen ? "d-none" : "d-flex flex-column flex-column" // DO NOT GET RID OF FLEX COLUMN
            // OR ELSE THE MAIN CONTENT WILL NOT WORK AND STACK HORIZONTALLY
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
