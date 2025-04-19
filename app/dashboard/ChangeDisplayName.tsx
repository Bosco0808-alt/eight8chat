"use client";
import { useState } from "react";
import DisplayNameForm from "../displaynameform";

const ChangeDisplayName = ({ userid }: { userid: number }) => {
  const [isSettingDisplayName, setIsSettingDisplayName] = useState(false);
  return (
    <>
      <button
        className="btn btn-primary m-2"
        onClick={() => setIsSettingDisplayName(true)}
      >
        Change Display Name
      </button>
      {/* isSettingDisplayName ? "setting" : "not setting" */}
      {isSettingDisplayName && (
        <DisplayNameForm
          userid={userid}
          welcome={false}
          setIsSettingDisplayName={setIsSettingDisplayName}
        />
      )}
    </>
  );
};

export default ChangeDisplayName;
