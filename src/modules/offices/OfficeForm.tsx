import React, { useEffect, useState } from "react";
import { OfficeModel } from "./OfficeModel";
import { UserModel } from "../users/models/userModel";
import isValidTelephone from "../../global/validation/telephoneValidation";
import { useDispatch } from "react-redux";
import { setAlert } from "../../other/alertSlice";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import isValidEmail from "../../global/validation/emailValidation";
import { addOffice } from "./OfficesSlice";
import axios from "axios";
import { postData } from "../../global/api";

interface Props {
  toggleShowOfficeForm: () => void;
}

const OfficeForm: React.FC<Props> = ({ toggleShowOfficeForm }) => {
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
    officeOwner: { userId: "" },
  });

  const dispatch = useDispatch();

  /*
   * check if all required fields are filled
   */
  const allRequiredFilled =
    office.officeLocation.country &&
    office.officeLocation.city &&
    office.officeLocation.street &&
    office.officeContact.telephone1 &&
    office.officeContact.email;

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
   *handle clear form
   */
  const handleClearForm = () => {
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
      officeContact: { telephone1: "", telephone2: "", email: "", fax: "" },
      officeOwner: { userId: currentUserId },
    });
  };

  /*
   * handle save office
   */
  const handleSaveOffice = async () => {
    // check if all the required fields are filled
    if (!allRequiredFilled) {
      dispatch(
        setAlert({
          message: "Please fill all the required fields marked by (*)",
          type: AlertTypeEnum.danger,
          status: true,
        })
      );
      return;
    }

    // check if the provided telephone1 is valid
    if (!isValidTelephone(office.officeContact.telephone1)) {
      dispatch(
        setAlert({
          message: "Invalid telephone1",
          type: AlertTypeEnum.danger,
          status: true,
        })
      );
      return;
    }

    // If telephone2 is provided, then check if telephone2 is valid
    if (
      office.officeContact.telephone2 &&
      !isValidTelephone(office.officeContact.telephone2)
    ) {
      dispatch(
        setAlert({
          message: "Invalid telephone2",
          type: AlertTypeEnum.danger,
          status: true,
        })
      );
      return;
    }

    // check if email is valid
    if (!isValidEmail(office.officeContact.email)) {
      dispatch(
        setAlert({
          message: "Invalid email address",
          type: AlertTypeEnum.danger,
          status: true,
        })
      );
      return;
    }

    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );
    setOffice((previousOffice) => ({
      ...previousOffice,
      officeOwner: { userId: currentUser.userId },
    }));

    try {
      const result = await postData("/add-new-office", office);
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

      dispatch(
        setAlert({
          message: "Office has been saved successfully.",
          type: AlertTypeEnum.success,
          status: true,
        })
      );
      console.log(result.data);
      dispatch(addOffice(result.data));
      handleClearForm();
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("SAVE OFFICE CANCELLED ", error.message);
      }
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

  return (
    <form
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}
      className="w-full absolute h-full bg-slate-700 p-10 pt-0 bottom-0 overflow-auto z-10"
    >
      <h1 className="py-3 pt-10 w-fill text-center font-bold text-3xl sticky top-0 bg-slate-700">
        Add new office
      </h1>

      {/* address section */}
      <div className="address flex flex-wrap justify-between">
        <h1 className="w-full pt-5 mb-5 text-xl font-bold border-b-2 text-gray-400 border-gray-400">
          Address
        </h1>

        {/* Country form field*/}
        <div className="form-group w-full lg:w-1/2 px-3 py-5">
          <label
            htmlFor="country"
            className={`${
              String(office.officeLocation.country).trim().length > 0
                ? "text-white"
                : "text-slate-700"
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
            className="w-full bg-slate-700 text-white outline-none border-b-2 border-gray-200 rounded-lg focus:border-blue-400"
            onChange={handleChange}
          />
          <small></small>
        </div>

        {/* City form field*/}
        <div className="form-group w-full lg:w-1/2 px-3 py-5">
          <label
            htmlFor="city"
            className={`${
              String(office.officeLocation.city).trim().length > 0
                ? "text-white"
                : "text-slate-700"
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
            className="w-full bg-slate-700 text-white outline-none border-b-2 border-gray-200 rounded-lg focus:border-blue-400"
            onChange={handleChange}
          />
          <small></small>
        </div>

        {/* State form field */}
        <div className="form-group w-full lg:w-1/2 px-3 py-5">
          <label
            htmlFor="state"
            className={`${
              office.officeLocation.state &&
              office.officeLocation.state.trim().length > 0
                ? "text-white"
                : "text-slate-700"
            }`}
          >
            State
          </label>
          <input
            type="text"
            id="state"
            placeholder="State"
            value={office.officeLocation.state}
            className="w-full bg-slate-700 text-white outline-none border-b-2 border-gray-200 rounded-lg focus:border-blue-400"
            onChange={handleChange}
          />
          <small></small>
        </div>

        {/* County form field */}
        <div className="form-group w-full lg:w-1/2 px-3 py-5">
          <label
            htmlFor="county"
            className={`${
              office.officeLocation.county &&
              office.officeLocation.county.trim().length > 0
                ? "text-white"
                : "text-slate-700"
            }`}
          >
            County
          </label>
          <input
            type="text"
            id="county"
            placeholder="County"
            value={office.officeLocation.county}
            className="w-full bg-slate-700 text-white outline-none border-b-2 border-gray-200 rounded-lg focus:border-blue-400"
            onChange={handleChange}
          />
          <small></small>
        </div>

        {/* Division form field */}
        <div className="form-group w-full lg:w-1/2 px-3 py-5">
          <label
            htmlFor="division"
            className={`${
              office.officeLocation.division &&
              office.officeLocation.division.trim().length > 0
                ? "text-white"
                : "text-slate-700"
            }`}
          >
            Division
          </label>
          <input
            type="text"
            id="division"
            placeholder="Division"
            value={office.officeLocation.division}
            className="w-full bg-slate-700 text-white outline-none border-b-2 border-gray-200 rounded-lg focus:border-blue-400"
            onChange={handleChange}
          />
          <small></small>
        </div>

        {/* Parish/Ward form field */}
        <div className="form-group w-full lg:w-1/2 px-3 py-5">
          <label
            htmlFor="parish"
            className={`${
              office.officeLocation.parish &&
              office.officeLocation.parish.trim().length > 0
                ? "text-white"
                : "text-slate-700"
            }`}
          >
            Parish/Ward
          </label>
          <input
            type="text"
            id="parish"
            placeholder="Parish/Ward"
            value={office.officeLocation.parish}
            className="w-full bg-slate-700 text-white outline-none border-b-2 border-gray-200 rounded-lg focus:border-blue-400"
            onChange={handleChange}
          />
          <small></small>
        </div>

        {/* Zone/LC1 form field */}
        <div className="form-group w-full lg:w-1/2 px-3 py-5">
          <label
            htmlFor="zone"
            className={`${
              office.officeLocation.zone &&
              office.officeLocation.zone.trim().length > 0
                ? "text-white"
                : "text-slate-700"
            }`}
          >
            Zone/LC1
          </label>
          <input
            type="text"
            id="zone"
            placeholder="Zone/LC1"
            value={office.officeLocation.zone}
            className="w-full bg-slate-700 text-white outline-none border-b-2 border-gray-200 rounded-lg focus:border-blue-400"
            onChange={handleChange}
          />
          <small></small>
        </div>

        {/* Street form field */}
        <div className="form-group w-full lg:w-1/2 px-3 py-5">
          <label
            htmlFor="street"
            className={`${
              office.officeLocation.street &&
              office.officeLocation.street.trim().length > 0
                ? "text-white"
                : "text-slate-700"
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
            className="w-full bg-slate-700 text-white outline-none border-b-2 border-gray-200 rounded-lg focus:border-blue-400"
            onChange={handleChange}
          />
          <small></small>
        </div>

        {/* Plot number form field */}
        <div className="form-group w-full lg:w-1/2 px-3 py-5">
          <label
            htmlFor="plotNumber"
            className={`${
              office.officeLocation.plotNumber &&
              office.officeLocation.plotNumber.trim().length > 0
                ? "text-white"
                : "text-slate-700"
            }`}
          >
            Plot number
          </label>
          <input
            type="text"
            id="plotNumber"
            placeholder="Plot number"
            value={office.officeLocation.plotNumber}
            className="w-full bg-slate-700 text-white outline-none border-b-2 border-gray-200 rounded-lg focus:border-blue-400"
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
        <div className="form-group w-full lg:w-1/2 px-3 py-5">
          <label
            htmlFor="telephone1"
            className={`${
              office.officeContact.telephone1.trim().length > 0
                ? "text-white"
                : "text-slate-700"
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
            className="w-full bg-slate-700 text-white outline-none border-b-2 border-gray-200 rounded-lg focus:border-blue-400"
            onChange={handleChange}
          />
          <small></small>
        </div>

        {/*Telephone2 form field*/}
        <div className="form-group w-full lg:w-1/2 px-3 py-5">
          <label
            htmlFor="telephone2"
            className={`${
              office.officeContact.telephone2.trim().length > 0
                ? "text-white"
                : "text-slate-700"
            }`}
          >
            Telephone2
          </label>
          <input
            type="text"
            id="telephone2"
            placeholder="Telephone2"
            value={office.officeContact.telephone2}
            className="w-full bg-slate-700 text-white outline-none border-b-2 border-gray-200 rounded-lg focus:border-blue-400"
            onChange={handleChange}
          />
          <small></small>
        </div>

        {/*Email form field*/}
        <div className="form-group w-full lg:w-1/2 px-3 py-5">
          <label
            htmlFor="email"
            className={`${
              office.officeContact.email.trim().length > 0
                ? "text-white"
                : "text-slate-700"
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
            className="w-full bg-slate-700 text-white outline-none border-b-2 border-gray-200 rounded-lg focus:border-blue-400"
            onChange={handleChange}
          />
          <small></small>
        </div>

        {/* Fax form field */}
        <div className="form-group w-full lg:w-1/2 px-3 py-5">
          <label
            htmlFor="fax"
            className={`${
              office.officeContact.fax &&
              office.officeContact.fax.trim().length > 0
                ? "text-white"
                : "text-slate-700"
            }`}
          >
            Fax
          </label>
          <input
            type="text"
            id="fax"
            placeholder="Fax"
            value={office.officeContact.fax ? office.officeContact.fax : ""}
            className="w-full bg-slate-700 text-white outline-none border-b-2 border-gray-200 rounded-lg focus:border-blue-400"
            onChange={handleChange}
          />
          <small></small>
        </div>
      </div>

      <div className="w-full flex justify-center py-10">
        <div className="w-full lg:w-1/4 flex flex-wrap justify-around items-center">
          <button
            className="bg-blue-950 hover:bg-blue-800 text-lg px-3 py-1"
            onClick={handleSaveOffice}
          >
            Save
          </button>
          <button
            className="bg-gray-950 hover:bg-gray-800 text-lg px-3 py-1"
            onClick={toggleShowOfficeForm}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default OfficeForm;
