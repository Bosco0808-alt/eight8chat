"use client";

import { setName } from "@/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DisplayNameForm = ({ userid }: { userid: number }) => {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName) {
      alert("Please enter display name!");
      return;
    }
    try {
      const unParsedResult = await setName(displayName, userid);
      const { result } = JSON.parse(unParsedResult);
      if (result === "ERR") {
        alert("There was an error. Please try again Later.");
        return;
      }
      if (result === "ERR_NO_DISPLAYNAME") {
        alert("Enter display name please!");
      } // prob won't happen as it is checked before
      if (result === "SUCCESS") {
        alert("Successfully set display name!");
        router.push("/chat");
      }
    } catch (err) {
      console.log(err);
      alert("There was an error. Try again Later please.");
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
        Start chatting!
      </button>
    </form>
  );
};

export default DisplayNameForm;
