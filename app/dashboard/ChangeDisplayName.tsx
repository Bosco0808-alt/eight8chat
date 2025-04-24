"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import { setName } from "@/actions";
import { useRouter } from "next/navigation";

const ChangeDisplayName = ({ userid }: { userid: number }) => {
  const router = useRouter();
  const [isSettingDisplayName, setIsSettingDisplayName] = useState(false);
  const handleClick = async () => {
    const result = await Swal.fire({
      title: "Edit Display Name",
      text: "Enter New Display Name",
      icon: "info",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      confirmButtonText: "Change display name",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      inputValidator(value) {
        if (!value) {
          return "Please enter a display name";
        }
      },
    });
    const { value: displayName } = result;
    if (!result.isConfirmed) {
      return;
    }
    try {
      const status = await setName(displayName, userid);
      const { result, message } = JSON.parse(status);
      if (result === "ERR") {
        throw new Error("Server Error!" + JSON.stringify(message));
      }
      await Swal.fire({
        title: "Success!",
        text: "Successfully set display name!",
        icon: "success",
        timer: 3000,
      });
    } catch (err) {
      console.error(err);
      await Swal.fire({
        title: "Error",
        text: "There was an error, please try again later",
        icon: "error",
        timer: 3000,
      });
    } finally {
      router.refresh();
    }
  };
  return (
    <button className="btn btn-primary m-2" onClick={handleClick}>
      Change Display Name
    </button>
  );
};

export default ChangeDisplayName;
