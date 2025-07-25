import React, { useEffect, useState } from "react";
import { TenantCreationModel } from "./TenantModel";
import { UserRoleEnum } from "../../global/enums/userRoleEnum";
import { UserModel } from "../users/models/userModel";
import { GENDER_DATA } from "../../global/PreDefinedData/PreDefinedData";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { postData } from "../../global/api";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { setAlert } from "../../other/alertSlice";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import TenantDetailsForm from "./TenantDetailsForm";
import checkRequiredFormFields from "../../global/validation/checkRequiredFormFields";
import { RxCross2 } from "react-icons/rx";
import markRequiredFormField from "../../global/validation/markRequiredFormField";

interface Props {
  setTenantData: React.Dispatch<
    React.SetStateAction<{
      facilityId: number;
      accommodationId: number;
      tenantId: number;
      unitNumber: string;
      expectedCheckIn: string | null;
    }>
  >;

  setIsCheckInNewTenant: React.Dispatch<React.SetStateAction<boolean>>;
}

const TenantForm: React.FC<Props> = ({
  setIsCheckInNewTenant,
  setTenantData,
}) => {
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
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    setUser((prev) => ({ ...prev, [id]: value }));
    // setTenant((prev) => ({ ...prev, [id]: value }));
  };

  // handle change select field values
  const handleChangeSelectFieldValues = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setUser((prev) => ({ ...prev, [id]: value }));
    // setTenant((prev) => ({ ...prev, [id]: value }));
  };

  // toggle show and hide password
  const toggleShowAndHidePassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  // save user details
  const handleSaveUserDetails = async () => {
    // check if all the required fiels are filled
    if (!canSaveUser) {
      checkRequiredFormFields([
        document.getElementById("firstName") as HTMLInputElement,
        document.getElementById("lastName") as HTMLInputElement,
        document.getElementById("gender") as HTMLInputElement,
        document.getElementById("userTelephone") as HTMLInputElement,
        document.getElementById("userPassword") as HTMLInputElement,
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
        console.log("SAVE USER CANCELLED: ");
      }
    }
  };

  if (isShowTenantDetailsForm)
    return (
      <TenantDetailsForm
        setTenant={setTenant}
        tenant={tenant}
        setIsShowTenantDetailsForm={setIsShowTenantDetailsForm}
        setIsCheckInNewTenant={setIsCheckInNewTenant}
        setTenantData={setTenantData}
      />
    );

  return (
    <form
      className="py-5 text-lg lg:text-sm lg:px-10 w-full lg:w-2/3 border shadow-lg"
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}
    >
      <div className="w-full flex justify-between items-center text-3xl p-2">
        <p className="">Add new tenant</p>
        <span
          className="lg:hover:bg-red-600 lg:hover:text-white p-1 cursor-pointer"
          onClick={() => {
            setIsCheckInNewTenant(false);
          }}
        >
          <RxCross2 />
        </span>
      </div>
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
              handleChangeTextFieldValues(e);
              markRequiredFormField(e.target);
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
              handleChangeTextFieldValues(e);
              markRequiredFormField(e.target);
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
              handleChangeSelectFieldValues(e);
              markRequiredFormField(e.target);
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
              handleChangeTextFieldValues(e);
              markRequiredFormField(e.target);
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
              handleChangeTextFieldValues(e);
              markRequiredFormField(e.target);
            }}
          />
          <small className="w-full text-red-500">Password is required!</small>

          <div
            className="password-show-hide text-2xl absolute top-14 lg:top-12 right-8  hover:text-blue-700 cursor-pointer"
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

export default TenantForm;
