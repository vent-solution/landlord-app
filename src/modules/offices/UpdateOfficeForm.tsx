import React, { useEffect, useState } from "react";
import { OfficeModel } from "./OfficeModel";
import { UserModel } from "../users/models/userModel";
import isValidTelephone from "../../global/validation/telephoneValidation";
import { useDispatch } from "react-redux";
import { setAlert } from "../../other/alertSlice";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import isValidEmail from "../../global/validation/emailValidation";
import axios from "axios";
import { setConfirm } from "../../other/ConfirmSlice";
import { setUserAction } from "../../global/actions/actionSlice";
import { useParams } from "react-router-dom";
import { putData } from "../../global/api";
import { updateOffice } from "./OfficesSlice";

interface Props {
  currentOffice: OfficeModel;
  toggleShowForm: () => void;
}

const UpdateOfficeForm: React.FC<Props> = ({
  currentOffice,
  toggleShowForm,
}) => {
  const [currentUserId, setCurrentUserId] = useState<string | undefined>("");
  const [office, setOffice] = useState<OfficeModel>({
    officeLocation: {
      country: "",
      city: "",
      state: "",
      county: "",
      division: "",
      parish: "",
      zone: "",
      street: "",
      plotNumber: "",
    },
    officeContact: { telephone1: "", telephone2: "", email: "", fax: "" },
    officeOwner: {
      userId: currentUserId,
      addedBy: { userId: null },
      linkedTo: { userId: null },
    },
  });

  const { officeId } = useParams();
  const dispatch = useDispatch();

  /*
   * handle change form fiel value
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setOffice((previousOffice) => ({
      ...previousOffice,
      officeLocation: {
        ...previousOffice.officeLocation,
        [id]: value,
      },
      officeContact: {
        ...previousOffice.officeContact,
        [id]: value,
      },
    }));
  };

  /*
   * handle update office
   */
  const handleUpdateOffice = async () => {
    // validate email before updating office
    if (!isValidEmail(office.officeContact.email)) {
      dispatch(setConfirm({ message: "", status: false }));
      dispatch(
        setAlert({
          message: "Invalid email address!",
          type: AlertTypeEnum.danger,
          status: true,
        })
      );
      return;
    }

    // validate telephone1 before updating office
    if (!isValidTelephone(office.officeContact.telephone1)) {
      dispatch(setConfirm({ message: "", status: false }));
      dispatch(
        setAlert({
          message: "Invalid telephone1!",
          type: AlertTypeEnum.danger,
          status: true,
        })
      );
      return;
    }

    // validate telephone2 before updating office
    if (
      office.officeContact.telephone2 &&
      !isValidTelephone(office.officeContact.telephone2)
    ) {
      dispatch(setConfirm({ message: "", status: false }));
      dispatch(
        setAlert({
          message: "Invalid telephone2!",
          type: AlertTypeEnum.danger,
          status: true,
        })
      );
      return;
    }

    // proceed updating office if all conditions are fullfilled
    try {
      const result = await putData(
        `/update-office/${Number(officeId)}`,
        office
      );
      // check if the responce has error code
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

      dispatch(setConfirm({ message: "", status: false }));
      dispatch(
        setAlert({
          message: "Office info updated successfully.",
          type: AlertTypeEnum.success,
          status: true,
        })
      );

      dispatch(updateOffice({ id: officeId, changes: result.data }));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("UPDATE OFFICE CANCELLED ", error.message);
      }
    } finally {
      dispatch(setConfirm({ message: "", status: false }));
    }
  };

  /*
   * set office owner user ID
   */
  useEffect(() => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );
    setCurrentUserId(String(currentUser.userId));
    setOffice((previousOffice) => ({
      ...previousOffice,
      officeOwner: { userId: currentUser.userId },
    }));
  }, []);

  // fill the form with the current office dtails
  useEffect(() => {
    if (currentOffice) {
      setOffice({
        officeLocation: {
          country: currentOffice.officeLocation.country,
          city: currentOffice.officeLocation.city,
          state: currentOffice.officeLocation.state,
          county: currentOffice.officeLocation.county,
          division: currentOffice.officeLocation.division,
          parish: currentOffice.officeLocation.parish,
          zone: currentOffice.officeLocation.zone,
          street: currentOffice.officeLocation.street,
          plotNumber: currentOffice.officeLocation.plotNumber,
        },
        officeContact: {
          telephone1: currentOffice.officeContact.telephone1,
          telephone2: currentOffice.officeContact.telephone2,
          email: currentOffice.officeContact.email,
          fax: currentOffice.officeContact.fax,
        },
        officeOwner: {
          userId: currentOffice.officeOwner.userId,
          addedBy: { userId: null },
          linkedTo: { userId: null },
        },
      });
    } else {
      setOffice({
        officeLocation: {
          country: "",
          city: "",
          state: "",
          county: "",
          division: "",
          parish: "",
          zone: "",
          street: "",
          plotNumber: "",
        },
        officeContact: {
          telephone1: "",
          telephone2: "",
          email: "",
          fax: "",
        },
        officeOwner: {
          userId: "",
          addedBy: { userId: null },
          linkedTo: { userId: null },
        },
      });
    }
  }, [currentOffice]);

  return (
    <form
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}
      className="w-full absolute top-2  h-5/6 lg:h-full bg-gray-100 p-10 pt-0 bottom-0 overflow-auto z-10"
    >
      <h1 className="py-3 pt-4 w-fill lg:text-center font-bold text-3xl sticky top-0  bg-gray-100 text-black">
        Update office
      </h1>

      {/* address section */}
      <div className="address flex flex-wrap justify-between">
        <h1 className="w-full pt-5 mb-5 text-xl font-bold border-b-2 text-gray-400 border-gray-400">
          Address
        </h1>

        {/* Country form field*/}
        <div className="form-group w-full lg:w-1/2 px-3 py-5 text-sm font-bold">
          <label
            htmlFor="country"
            className={`${
              String(office.officeLocation.country).trim().length > 0
                ? "text-black"
                : "text-gray-100"
            }`}
          >
            Country
            <span
              className={`${
                String(office.officeLocation.country).trim().length > 0
                  ? "text-red-600"
                  : "text-slate-700"
              }`}
            >
              *
            </span>
          </label>
          <input
            autoFocus
            type="text"
            id="country"
            placeholder="Country*"
            value={office.officeLocation.country}
            className="w-full text-gray-600 outline-none border-b-2 border-gray-200 rounded-lg focus:border-blue-400"
            onChange={handleChange}
          />
          <small></small>
        </div>

        {/* City form field*/}
        <div className="form-group w-full lg:w-1/2 px-3 py-5 text-sm font-bold">
          <label
            htmlFor="city"
            className={`${
              String(office.officeLocation.city).trim().length > 0
                ? "text-black"
                : "text-gray-100"
            }`}
          >
            City{" "}
            <span
              className={`${
                String(office.officeLocation.city).trim().length > 0
                  ? "text-red-600"
                  : "text-slate-700"
              }`}
            >
              *
            </span>
          </label>
          <input
            type="text"
            id="city"
            placeholder="City*"
            value={office.officeLocation.city}
            className="w-full text-gray-600 outline-none border-b-2 border-gray-200 rounded-lg focus:border-blue-400"
            onChange={handleChange}
          />
          <small></small>
        </div>

        {/* State form field */}
        <div className="form-group w-full lg:w-1/2 px-3 py-5 text-sm font-bold">
          <label
            htmlFor="state"
            className={`${
              office.officeLocation.state &&
              office.officeLocation.state.trim().length > 0
                ? "text-black"
                : "text-gray-100"
            }`}
          >
            State
          </label>
          <input
            type="text"
            id="state"
            placeholder="State"
            value={office.officeLocation.state}
            className="w-full text-gray-600 outline-none border-b-2 border-gray-200 rounded-lg focus:border-blue-400"
            onChange={handleChange}
          />
          <small></small>
        </div>

        {/* County form field */}
        <div className="form-group w-full lg:w-1/2 px-3 py-5 text-sm font-bold">
          <label
            htmlFor="county"
            className={`${
              office.officeLocation.county &&
              office.officeLocation.county.trim().length > 0
                ? "text-black"
                : "text-gray-100"
            }`}
          >
            County
          </label>
          <input
            type="text"
            id="county"
            placeholder="County"
            value={office.officeLocation.county}
            className="w-full text-gray-600 outline-none border-b-2 border-gray-200 rounded-lg focus:border-blue-400"
            onChange={handleChange}
          />
          <small></small>
        </div>

        {/* Division form field */}
        <div className="form-group w-full lg:w-1/2 px-3 py-5 text-sm font-bold">
          <label
            htmlFor="division"
            className={`${
              office.officeLocation.division &&
              office.officeLocation.division.trim().length > 0
                ? "text-black"
                : "text-gray-100"
            }`}
          >
            Division
          </label>
          <input
            type="text"
            id="division"
            placeholder="Division"
            value={office.officeLocation.division}
            className="w-full text-gray-600 outline-none border-b-2 border-gray-200 rounded-lg focus:border-blue-400"
            onChange={handleChange}
          />
          <small></small>
        </div>

        {/* Parish/Ward form field */}
        <div className="form-group w-full lg:w-1/2 px-3 py-5 text-sm font-bold">
          <label
            htmlFor="parish"
            className={`${
              office.officeLocation.parish &&
              office.officeLocation.parish.trim().length > 0
                ? "text-black"
                : "text-gray-100"
            }`}
          >
            Parish/Ward
          </label>
          <input
            type="text"
            id="parish"
            placeholder="Parish/Ward"
            value={office.officeLocation.parish}
            className="w-full text-gray-600 outline-none border-b-2 border-gray-200 rounded-lg focus:border-blue-400"
            onChange={handleChange}
          />
          <small></small>
        </div>

        {/* Zone/LC1 form field */}
        <div className="form-group w-full lg:w-1/2 px-3 py-5 text-sm font-bold">
          <label
            htmlFor="zone"
            className={`${
              office.officeLocation.zone &&
              office.officeLocation.zone.trim().length > 0
                ? "text-black"
                : "text-gray-100"
            }`}
          >
            Zone/LC1
          </label>
          <input
            type="text"
            id="zone"
            placeholder="Zone/LC1"
            value={office.officeLocation.zone}
            className="w-full text-gray-600 outline-none border-b-2 border-gray-200 rounded-lg focus:border-blue-400"
            onChange={handleChange}
          />
          <small></small>
        </div>

        {/* Street form field */}
        <div className="form-group w-full lg:w-1/2 px-3 py-5 text-sm font-bold">
          <label
            htmlFor="street"
            className={`${
              office.officeLocation.street &&
              office.officeLocation.street.trim().length > 0
                ? "text-black"
                : "text-gray-100"
            }`}
          >
            Street{" "}
            <span
              className={`${
                office.officeLocation.street &&
                office.officeLocation.street.trim().length > 0
                  ? "text-red-600"
                  : "text-slate-700"
              }`}
            >
              *
            </span>
          </label>
          <input
            type="text"
            id="street"
            placeholder="Street*"
            value={office.officeLocation.street}
            className="w-full text-gray-600 outline-none border-b-2 border-gray-200 rounded-lg focus:border-blue-400"
            onChange={handleChange}
          />
          <small></small>
        </div>

        {/* Plot number form field */}
        <div className="form-group w-full lg:w-1/2 px-3 py-5 text-sm font-bold">
          <label
            htmlFor="plotNumber"
            className={`${
              office.officeLocation.plotNumber &&
              office.officeLocation.plotNumber.trim().length > 0
                ? "text-black"
                : "text-gray-100"
            }`}
          >
            Plot number
          </label>
          <input
            type="text"
            id="plotNumber"
            placeholder="Plot number"
            value={office.officeLocation.plotNumber}
            className="w-full text-gray-600 outline-none border-b-2 border-gray-200 rounded-lg focus:border-blue-400"
            onChange={handleChange}
          />
          <small></small>
        </div>
      </div>

      {/* contact section */}
      <div className="contact w-full flex flex-wrap justify-between ">
        <h1 className="w-full pt-5 mb-5 text-xl text-gray-400 font-bold border-b-2 border-gray-400">
          Contact
        </h1>

        {/*Telephone1 form field*/}
        <div className="form-group w-full lg:w-1/2 px-3 py-5 text-sm font-bold">
          <label
            htmlFor="telephone1"
            className={`${
              office.officeContact.telephone1.trim().length > 0
                ? "text-black"
                : "text-gray-100"
            }`}
          >
            Telephone1{" "}
            <span
              className={`${
                office.officeContact.telephone1.trim().length > 0
                  ? "text-red-600"
                  : "text-slate-700"
              }`}
            >
              *
            </span>
          </label>
          <input
            type="text"
            id="telephone1"
            placeholder="Telephone1*"
            value={office.officeContact.telephone1}
            className="w-full text-gray-600 outline-none border-b-2 border-gray-200 rounded-lg focus:border-blue-400"
            onChange={handleChange}
          />
          <small></small>
        </div>

        {/*Telephone2 form field*/}
        <div className="form-group w-full lg:w-1/2 px-3 py-5 text-sm font-bold">
          <label
            htmlFor="telephone2"
            className={`${
              office.officeContact.telephone2.trim().length > 0
                ? "text-black"
                : "text-gray-100"
            }`}
          >
            Telephone2
          </label>
          <input
            type="text"
            id="telephone2"
            placeholder="Telephone2"
            value={office.officeContact.telephone2}
            className="w-full text-gray-600 outline-none border-b-2 border-gray-200 rounded-lg focus:border-blue-400"
            onChange={handleChange}
          />
          <small></small>
        </div>

        {/*Email form field*/}
        <div className="form-group w-full lg:w-1/2 px-3 py-5 text-sm font-bold">
          <label
            htmlFor="email"
            className={`${
              office.officeContact.email.trim().length > 0
                ? "text-black"
                : "text-gray-100"
            }`}
          >
            Email
            <span
              className={`${
                office.officeContact.email.trim().length > 0
                  ? "text-red-600"
                  : "text-slate-700"
              }`}
            >
              *
            </span>
          </label>
          <input
            type="text"
            id="email"
            placeholder="Email*"
            value={office.officeContact.email}
            className="w-full text-gray-600 outline-none border-b-2 border-gray-200 rounded-lg focus:border-blue-400"
            onChange={handleChange}
          />
          <small></small>
        </div>

        {/* Fax form field */}
        <div className="form-group w-full lg:w-1/2 px-3 py-5 text-sm font-bold">
          <label
            htmlFor="fax"
            className={`${
              office.officeContact.fax &&
              office.officeContact.fax.trim().length > 0
                ? "text-black"
                : "text-gray-100"
            }`}
          >
            Fax
          </label>
          <input
            type="text"
            id="fax"
            placeholder="Fax"
            value={office.officeContact.fax ? office.officeContact.fax : ""}
            className="w-full text-gray-600 outline-none border-b-2 border-gray-200 rounded-lg focus:border-blue-400"
            onChange={handleChange}
          />
          <small></small>
        </div>
      </div>

      <div className="w-full flex justify-center py-10 pb-24">
        <div className="w-full lg:w-1/2 flex flex-wrap justify-around items-center">
          <button
            className="bg-blue-700 hover:bg-blue-400 text-lg py-1 w-1/3 rounded-lg"
            onClick={() => {
              dispatch(
                setConfirm({
                  message: "Are you sure you want to update this office?",
                  status: true,
                })
              );

              dispatch(
                setUserAction({ userAction: () => handleUpdateOffice() })
              );
            }}
          >
            Save
          </button>

          <button
            className="visible lg:hidden bg-gray-700 hover:bg-gray-400 text-lg py-1 w-1/3 rounded-lg"
            onClick={toggleShowForm}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default UpdateOfficeForm;
