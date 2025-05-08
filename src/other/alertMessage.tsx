import React, { useEffect } from "react";
import { GiCheckMark } from "react-icons/gi";
import { CgDanger } from "react-icons/cg";
import { RxCross2 } from "react-icons/rx";
import { AlertTypeEnum } from "../global/enums/alertTypeEnum";
import { useDispatch, useSelector } from "react-redux";
import { getAlert, setAlert } from "./alertSlice";
import { AppDispatch } from "../app/store";

interface Props {}
let AlertMessage: React.FC<Props> = () => {
  const dispatch = useDispatch<AppDispatch>();

  const alertData = useSelector(getAlert);

  const closeAlert = () => {
    dispatch(setAlert({ message: "", type: "", status: false }));
  };

  // close the alert after a specified period of time.
  useEffect(() => {
    const timeOut = setTimeout(() => {
      dispatch(setAlert({ message: "", type: "", status: false }));
    }, 10000);
    return () => clearTimeout(timeOut);
  });

  return (
    <div
      className={`alert-overlay fixed top-0 left-0 right-0 bottom-0 flex items-center lg:items-start justify-center lg:justify-end ${
        !alertData.status === false ? "show" : "hidden"
      } `}
    >
      <div
        className={`alert-content w-3/4  lg:w-1/4 p-10 bg-white h-fit flex items-center justify-between relative lg:absolute lg:right-10  ${
          !alertData.status === false ? "top-3" : "-top-full"
        }`}
      >
        <div
          className="close-alert text-black absolute top-2 right-2 text-lg hover:bg-gray-200 hover:text-red-600 hover:p-2 cursor-pointer"
          onClick={closeAlert}
        >
          <RxCross2 />
        </div>
        <div className="alert-icon">
          {alertData.type === AlertTypeEnum.danger ? (
            <CgDanger className="text-red-600 text-7xl" />
          ) : alertData.type === AlertTypeEnum.warning ? (
            <CgDanger />
          ) : (
            <GiCheckMark className="text-green-600 text-5xl" />
          )}
        </div>
        <div className="alert-message text-black text-sm w-4/5 font-bold">
          <p>{alertData.message}</p>
        </div>
      </div>
    </div>
  );
};

AlertMessage = React.memo(AlertMessage);
export default AlertMessage;
