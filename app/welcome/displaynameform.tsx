"use client";

import { setName } from "@/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

const DisplayNameForm = ({ userid }: { userid: number }) => {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName) {
      Swal.fire({
        text: "Please enter display name!",
        timer: 3000,
        icon: "error",
      });
      return;
    }
    setShowLoadingSpinner(true);
    try {
      const unParsedResult = await setName(displayName, userid);
      const { result } = JSON.parse(unParsedResult);
      if (result === "ERR") {
        Swal.fire({
          text: "There was an error. Please try again Later.",
          timer: 3000,
          icon: "error",
        });
        return;
      }
      if (result === "ERR_NO_DISPLAYNAME") {
        Swal.fire({
          text: "Enter display name please!",
          timer: 3000,
          icon: "error",
        });
        return;
      } // prob won't happen as it is checked before
      if (result === "SUCCESS") {
        Swal.fire({
          text: "Successfully set display name!",
          timer: 3000,
          icon: "success",
        });
        setShowLoadingSpinner(false);
        router.push("/chat");
      }
    } catch (err) {
      console.log(err);
      Swal.fire("There was an error. Try again Later please.");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <label className="m-2">Enter your display name: </label>
      <input
        className="form-control m-2"
        name="displayname"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        required
      />
      <button type="submit" className="btn btn-primary m-2">
        Start chatting
      </button>
      {showLoadingSpinner && (
        <>
          <br />
          <div className="spinner-border m-2"></div>
        </>
      )}
    </form>
  );
};

export default DisplayNameForm;
