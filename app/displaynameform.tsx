"use client";

import { setName } from "@/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Type = (arg: boolean) => any;

const DisplayNameForm = ({
  userid,
  welcome,
  setIsSettingDisplayName,
}: {
  userid: number;
  welcome: boolean;
  setIsSettingDisplayName: Type;
}) => {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName) {
      alert("Please enter display name!");
      return;
    }
    setShowLoadingSpinner(true);
    try {
      const unParsedResult = await setName(displayName, userid);
      const { result } = JSON.parse(unParsedResult);
      if (result === "ERR") {
        alert("There was an error. Please try again Later.");
        return;
      }
      if (result === "ERR_NO_DISPLAYNAME") {
        alert("Enter display name please!");
        return;
      } // prob won't happen as it is checked before
      if (result === "SUCCESS") {
        setShowLoadingSpinner(false);
        alert("Successfully set display name!"); // TODO: implement own alert
        !welcome && setIsSettingDisplayName(false);
        if (welcome) {
          router.push("/chat");
        } else {
          router.refresh();
        }
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
        {welcome ? "Start chatting!" : "Confirm"}
      </button>
      {!welcome && (
        <button
          className="btn btn-danger"
          onClick={() => setIsSettingDisplayName(false)}
        >
          Cancel
        </button>
      )}
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
