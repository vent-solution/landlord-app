import React from "react";
import { FaQuestion } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getConfirm, setConfirm } from "./ConfirmSlice";
import { AppDispatch } from "../app/store";
import { getAction } from "../global/actions/actionSlice";

interface Props {}

const ConfirmMessage: React.FC<Props> = () => {
  const dispatch = useDispatch<AppDispatch>();

  const confirmData = useSelector(getConfirm);
  const userAction = useSelector(getAction);

  // const handleAction = async () => {
  //   try {
  //     await action();
  //   } catch (error) {
  //     console.error("Action failed:", error);
  //   } finally {
  //     dispatch(setConfirm({ message: "", status: false }));
  //   }
  // };

  return (
    <div
      className={`alert-overlay fixed top-0 left-0 right-0 bottom-0 flex items-center lg:items-start justify-center lg:justify-end ${
        confirmData.status ? "visible" : "hidden"
      }`}
    >
      <div
        className={`alert-content w-3/4 lg:w-1/4 py-4 px-10 bg-white h-fit flex flex-wrap justify-center items-center relative lg:absolute lg:right-10 ${
          confirmData.status ? "top-3" : "-top-full"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="alert-icon flex justify-center items-center">
          <FaQuestion className="text-orange-800 text-5xl" />
        </div>
        <div className="alert-message text-black text-sm w-3/4 font-bold py-5">
          <p>{confirmData.message}</p>
        </div>
        <div className="p-3 w-2/3 flex justify-around">
          <button
            className="bg-gray-100 hover:bg-gray-200 px-5 py-1 text-black text-xl font-bold"
            onClick={() => userAction.userAction()}
          >
            Yes
          </button>
          <button
            className="bg-gray-100 hover:bg-gray-200 px-5 py-1 text-xl text-blue-700 font-bold"
            onClick={() => dispatch(setConfirm({ message: "", status: false }))}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmMessage;
