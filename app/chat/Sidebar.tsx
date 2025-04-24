"use client";
import { useAtom } from "jotai";
import { isOpenAtom } from "@/atoms";
import Swal from "sweetalert2";

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useAtom(isOpenAtom); // For responsive sidebar
  const handleClick = async () => {
    // Add friend
    const result = await Swal.fire({
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
    console.log(friendID);
  };
  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        <nav
          className={`col-md-1 bg-light ${
            isOpen ? "d-flex" : "d-none d-md-flex"
          } flex-column align-items-center`}
        >
          <h2 className="p-3">Friends</h2>
          <button className="btn btn-primary" onClick={handleClick}>
            + Add New Friend
          </button>
          <button className="btn btn-secondary mt-2">
            Check Friend Requests
          </button>
        </nav>
        <main className={`col-12 col-md-9 ${isOpen ? "d-none" : "d-flex"}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
