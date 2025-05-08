import React, { useCallback, useState } from "react";
import { OfficeModel } from "./OfficeModel";
import axios from "axios";
import { deleteData } from "../../global/api";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import { setAlert } from "../../other/alertSlice";
import { setConfirm } from "../../other/ConfirmSlice";
import { deleteOffice } from "./OfficesSlice";
import { useDispatch } from "react-redux";
import { setUserAction } from "../../global/actions/actionSlice";
import { useNavigate } from "react-router-dom";
import UpdateOfficeForm from "./UpdateOfficeForm";
import { FaMapLocationDot } from "react-icons/fa6";
import { SlSpeech } from "react-icons/sl";

interface Props {
  office: OfficeModel;
}
const OfficeDetails: React.FC<Props> = ({ office }) => {
  const [showOfficeForm, setShowOfficeForm] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // show and hide office form
  const toggleShowForm = () => setShowOfficeForm(!showOfficeForm);

  // handle delete offfice
  const handleDeleteOffice = useCallback(async () => {
    try {
      const result = await deleteData(`/delete-office/${office.officeId}`);
      if (result.data.status && result.data.status !== "OK") {
        dispatch(
          setAlert({
            message: result.data.message,
            type: AlertTypeEnum.danger,
            status: true,
          })
        );
        return;
      }
      dispatch(deleteOffice(office.officeId));

      dispatch(setConfirm({ message: "", status: false }));

      dispatch(
        setAlert({
          message: result.data.message,
          type: AlertTypeEnum.success,
          status: true,
        })
      );

      navigate("/offices");
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("DELETE OFFICE CANCELLED ", error.message);
      }
    }
  }, [dispatch, office.officeId, navigate]);

  return (
    <div className="w-full h-svh flex flex-rwap justify-start relative">
      <div
        className={`${
          showOfficeForm ? "block" : "hidden"
        } lg:block  form py-10 right-0 absolute text-teal-50 h-full w-full md:w-full lg:w-1/2`}
      >
        <UpdateOfficeForm
          currentOffice={office}
          toggleShowForm={toggleShowForm}
        />
      </div>
      <div className="w-full lg:w-1/2 p-10">
        <div className="w-full p-10 flex justify-start items-center border-y-2 border-blue-200">
          <div className="text-6xl px-5 text-blue-200">
            <FaMapLocationDot />
          </div>
          <div className="">
            <p className="text-sm">
              <b>Country: </b>
              <i className="">{office.officeLocation.country}</i>
            </p>
            <p className="text-sm">
              <b>State: </b>
              <i>{office.officeLocation.state}</i>
            </p>
            <p className="text-sm">
              <b>City: </b>
              <i>{office.officeLocation.city}</i>
            </p>
            <p className="text-sm">
              <b>County: </b>
              <i>{office.officeLocation.county}</i>
            </p>
            <p className="text-sm">
              <b>Division: </b>
              <i>{office.officeLocation.division}</i>
            </p>
            <p className="text-sm">
              <b>Parish: </b>
              <i>{office.officeLocation.parish}</i>
            </p>
            <p className="text-sm">
              <b>Zone: </b>
              <i>{office.officeLocation.zone}</i>
            </p>
            <p className="text-sm">
              <b>Street: </b>
              <i>{office.officeLocation.street}</i>
            </p>
            <p className="text-sm">
              <b>Plot Number: </b>
              <i>{office.officeLocation.plotNumber}</i>
            </p>
          </div>
        </div>

        <div className="w-full p-10 flex justify-start items-center border-b-2 border-blue-200">
          <div className="text-6xl px-5 text-blue-200">
            <SlSpeech />
          </div>
          <div className="">
            <p className="text-sm">
              <b>Telephon1: </b>
              <i>{office.officeContact.telephone1}</i>
            </p>
            <p className="text-sm">
              <b>Telephone2: </b>
              <i>{office.officeContact.telephone2}</i>
            </p>
            <p className="text-sm">
              <b>Email: </b>
              <i>{office.officeContact.email}</i>
            </p>
            <p className="text-sm">
              <b>Fax: </b>
              <i>{office.officeContact.fax}</i>
            </p>
          </div>
        </div>
        <div className="w-full p-10 flex justify-center items-center">
          <div className="w-full lg:w-1/2 flex justify-around items-center">
            <button
              className="bg-red-500 hover:bg-red-300 w-1/3 p-2 text-white text-sm font-bold"
              onClick={() => {
                dispatch(
                  setConfirm({
                    message: `Do you want to delete office ${
                      office.officeLocation.country +
                      " " +
                      office.officeLocation.city
                    }`,
                    status: true,
                  })
                );
                dispatch(
                  setUserAction({ userAction: () => handleDeleteOffice() })
                );
              }}
            >
              Delete
            </button>

            <button
              className="block lg:hidden bg-gray-500 hover:bg-gray-300 w-1/3 p-2 text-white text-sm font-bold"
              onClick={toggleShowForm}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeDetails;
