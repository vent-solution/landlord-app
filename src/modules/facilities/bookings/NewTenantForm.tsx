import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { postData } from "../../../global/api";
import { AlertTypeEnum } from "../../../global/enums/alertTypeEnum";
import { UserRoleEnum } from "../../../global/enums/userRoleEnum";
import { GENDER_DATA } from "../../../global/PreDefinedData/PreDefinedData";
import { setAlert } from "../../../other/alertSlice";
import { TenantCreationModel } from "../../tenants/TenantModel";
import { UserModel } from "../../users/models/userModel";
import NewTenantDetailsForm from "./NewTenantDetailsForm";
import { RxCross1 } from "react-icons/rx";
import checkRequiredFormFields from "../../../global/validation/checkRequiredFormFields";
import markRequiredFormField from "../../../global/validation/markRequiredFormField";
import { BookingCreationModel } from "./BookingModel";

interface Props {
  setIsNewTenant: React.Dispatch<React.SetStateAction<boolean>>;
  setBookingData: React.Dispatch<React.SetStateAction<BookingCreationModel>>;
}

let NewTenantForm: React.FC<Props> = ({ setIsNewTenant, setBookingData }) => {
  const [user, setUser] = useState<UserModel>({
    firstName: "",
    lastName: "",
    otherNames: "",
    gender: "",
    userRole: UserRoleEnum.tenant,
    userTelephone: "",
    userEmail: "",
    userPassword: "",
    addedBy: { userId: null },
    linkedTo: null,
  });

  const [tenant, setTenant] = useState<TenantCreationModel>({
    user: {
      userId: 0,
    },

    companyName: "",

    idType: "",
    nationalId: "",

    nextOfKin: {
      nokName: "",
      nokEmail: "",
      nokTelephone: "",
    },
  });

  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  const [isShowTenantDetailsForm, setIsShowTenantDetailsForm] =
    useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();

  // check for required form fields before saving user
  const canSaveUser =
    String(user.firstName).trim().length > 0 &&
    String(user.lastName).trim().length > 0 &&
    String(user.gender).trim().length > 0 &&
    String(user.userRole).trim().length > 0 &&
    String(user.userTelephone).trim().length > 0 &&
    String(user.userPassword).trim().length > 0;

  // get current user info
  useEffect(() => {
    const cureent_user: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    setUser((prev) => ({
      ...prev,
      addedBy: { userId: String(cureent_user.userId) },
    }));
  }, []);

  // handle change text field values
  const handleChangeTextFieldValues = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value, type } = e.target;

    type === "number"
      ? setUser((prev) => ({ ...prev, [id]: Number(value) }))
      : setUser((prev) => ({ ...prev, [id]: value }));

    type === "number"
      ? setTenant((prev) => ({ ...prev, [id]: Number(value) }))
      : setTenant((prev) => ({ ...prev, [id]: value }));
  };

  // toggle show and hide password
  const toggleShowAndHidePassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  // save user details
  const handleSaveUserDetails = async () => {
    // check if all the required fields are filled
    if (!canSaveUser) {
      checkRequiredFormFields([
        document.getElementById("firstName") as HTMLInputElement,
        document.getElementById("lastName") as HTMLInputElement,
        document.getElementById("userTelephone") as HTMLInputElement,
        document.getElementById("userPassword") as HTMLInputElement,
      ]);

      checkRequiredFormFields([
        document.getElementById("gender") as HTMLSelectElement,
      ]);

      dispatch(
        setAlert({
          status: true,
          type: AlertTypeEnum.danger,
          message: "Please fill in all the required fields marked by (*)",
        })
      );
      return;
    }

    try {
      const result = await postData("/saveUser", user);

      if (result.data.status && result.data.status !== "OK") {
        dispatch(
          setAlert({
            status: true,
            type: AlertTypeEnum.danger,
            message: result.data.message,
          })
        );

        return;
      }

      setUser(result.data);
      setTenant((prev) => ({ ...prev, user: { userId: result.data.userId } }));

      setIsShowTenantDetailsForm(true);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("SAVE USER CANCELLED: ", error.message);
      }
    }
  };

  if (isShowTenantDetailsForm)
    return (
      <NewTenantDetailsForm
        setTenant={setTenant}
        tenant={tenant}
        setBookingData={setBookingData}
        setIsNewTenant={setIsNewTenant}
        setIsShowTenantDetailsForm={setIsShowTenantDetailsForm}
      />
    );

  return (
    <form
      className="py-5 text-lg lg:text-sm px-5 lg:px-10 w-full lg:w-2/3 bg-gray-100"
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}
    >
      <h1 className="w-full text-start flex justify-between py-5">
        <span className="text-xl lg:text-3xl font-bold ">Add new tenant</span>
        <span
          className="text-xl cursor-pointer p-2 lg:hover:bg-red-500 lg:hover:text-white"
          onClick={() => setIsNewTenant(false)}
        >
          <RxCross1 />
        </span>
      </h1>

      <div className="flex flex-wrap justify-between w-full">
        {/* first name form field */}
        <div className="form-group w-full lg:w-1/2 p-5">
          <label htmlFor="firstName" className="w-full font-bold">
            First name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            placeholder="Enter first name"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400"
            onChange={(e) => {
              markRequiredFormField(e.target);
              handleChangeTextFieldValues(e);
            }}
          />
          <small className="w-full text-red-500">First name is required!</small>
        </div>

        {/* last name form field */}
        <div className="form-group w-full lg:w-1/2 p-5">
          <label htmlFor="lastName" className="w-full font-bold">
            Last name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            value={String(user.lastName)}
            placeholder="Enter last name"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400"
            onChange={(e) => {
              markRequiredFormField(e.target);
              handleChangeTextFieldValues(e);
            }}
          />
          <small className="w-full text-red-500">Last name is required!</small>
        </div>

        {/* other names form field */}
        <div className="form-group w-full p-5">
          <label htmlFor="otherNames" className="w-full font-bold">
            Other names <span className="text-red-600"></span>
          </label>
          <input
            type="text"
            id="otherNames"
            placeholder="Enter other names"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400"
            onChange={handleChangeTextFieldValues}
          />
          <small className="w-full"></small>
        </div>

        {/* gender form field */}
        <div className="form-group w-full lg:w-1/2 p-5">
          <label htmlFor="gender" className="w-full font-bold">
            Gender <span className="text-red-600">*</span>
          </label>
          <select
            id="gender"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400"
            onChange={(e) => {
              markRequiredFormField(e.target);
              handleChangeTextFieldValues(e);
            }}
          >
            <option value="">SELECT GENDER</option>
            {GENDER_DATA.map((gender, index) => (
              <option key={index} value={gender.value}>
                {gender.label}
              </option>
            ))}
          </select>
          <small className="w-full text-red-500">Gender is required!</small>
        </div>

        {/* phone form input field */}
        <div className="form-group w-full lg:w-1/2 p-5">
          <label htmlFor="userTelephone" className="w-full font-bold">
            Telephone <span className="text-red-600">*</span>
          </label>

          <input
            type="tel"
            id="userTelephone"
            placeholder="Enter telephone (+158344)"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400"
            onChange={(e) => {
              markRequiredFormField(e.target);
              handleChangeTextFieldValues(e);
            }}
          />
          <small className="w-full text-red-500">Telephone is required!</small>
        </div>

        {/* email form input field */}
        <div className="form-group w-full lg:w-1/2 p-5">
          <label htmlFor="userEmail" className="w-full font-bold">
            Email <span className="text-red-600"></span>
          </label>
          <input
            type="email"
            id="userEmail"
            placeholder="Enter email (eg. abc@domain.com)"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400"
            onChange={handleChangeTextFieldValues}
          />
          <small className="w-full"></small>
        </div>

        {/* email form input field */}
        <div className="form-group w-full lg:w-1/2 p-5 relative">
          <label htmlFor="userPassword" className="w-full font-bold">
            Password <span className="text-red-600">*</span>
          </label>
          <input
            type={`${isShowPassword ? "text" : "password"}`}
            id="userPassword"
            placeholder="Enter user password"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400"
            onChange={(e) => {
              markRequiredFormField(e.target);
              handleChangeTextFieldValues(e);
            }}
          />
          <small className="w-full text-red-500">Password is required!</small>

          <div
            className="password-show-hide text-2xl absolute top-1/2 right-8  hover:text-blue-700 cursor-pointer"
            onClick={toggleShowAndHidePassword}
          >
            {isShowPassword ? <FaEye /> : <FaEyeSlash />}
          </div>
        </div>

        {/* email form input field */}
        <div className="form-group w-full p-10 flex justify-center items-center">
          <input
            type="submit"
            id="save-user"
            value={"Next"}
            className="w-fit py-1 px-5 bg-blue-700 lg:hover:bg-blue-400 text-white text-2xl cursor-pointer"
            onClick={handleSaveUserDetails}
          />
        </div>
      </div>
    </form>
  );
};

NewTenantForm = React.memo(NewTenantForm);
export default NewTenantForm;
