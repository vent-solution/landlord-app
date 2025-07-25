import React from "react";
import { TenantCreationModel, TenantModel } from "./TenantModel";
import axios from "axios";
import { postData } from "../../global/api";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { setAlert } from "../../other/alertSlice";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import { NATIONAL_ID_TYPE } from "../../global/PreDefinedData/PreDefinedData";
import { useLocation, useParams } from "react-router-dom";
import checkRequiredFormFields from "../../global/validation/checkRequiredFormFields";
import markRequiredFormField from "../../global/validation/markRequiredFormField";

interface Props {
  tenant: TenantCreationModel;
  setTenant: React.Dispatch<React.SetStateAction<TenantCreationModel>>;
  setIsShowTenantDetailsForm: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCheckInNewTenant: React.Dispatch<React.SetStateAction<boolean>>;
  setTenantData: React.Dispatch<
    React.SetStateAction<{
      facilityId: number;
      accommodationId: number;
      tenantId: number;
      unitNumber: string;
      expectedCheckIn: string | null;
    }>
  >;
}

const TenantDetailsForm: React.FC<Props> = ({
  tenant,
  setTenant,
  setTenantData,
  setIsShowTenantDetailsForm,
  setIsCheckInNewTenant,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  // check if can save tenant details
  const canSaveTenant =
    tenant.nationalId &&
    tenant.idType &&
    tenant.nextOfKin?.nokTelephone &&
    tenant.nextOfKin.nokName;

  // handle change text field values
  const handleChangeTextFieldValues = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    setTenant((prev) => ({ ...prev, [id]: value }));
  };

  // handle change select field values
  const handleChangeSelectFieldValues = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setTenant((prev) => ({ ...prev, [id]: value }));
  };

  // save user details
  const handleSaveTenantDetails = async () => {
    // check if all the required fiels are filled
    if (!canSaveTenant) {
      checkRequiredFormFields([
        document.getElementById("nationalId") as HTMLInputElement,
        document.getElementById("idType") as HTMLInputElement,
        document.getElementById("fullName") as HTMLInputElement,
        document.getElementById("nokTelephone") as HTMLInputElement,
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
      const result = await postData("/addNewTenant", tenant);

      if (!result) {
        dispatch(
          setAlert({
            status: true,
            type: AlertTypeEnum.danger,
            message: "Internal server error!",
          })
        );
        return;
      }

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

      setTenantData((prev) => ({
        ...prev,
        tenantId: Number(result.data.tenantId),
      }));

      setIsShowTenantDetailsForm(false);
      setIsCheckInNewTenant(false);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("SAVE USER CANCELLED: ", error.message);
      }
    }
  };

  return (
    <form
      className="py-5 text-lg lg:text-sm lg:px-10 w-full lg:w-2/3 border shadow-lg"
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}
    >
      <div className="flex flex-wrap justify-between w-full">
        {/* company name form input field */}
        <div className="form-group w-full p-5  ">
          <label htmlFor="companyName" className="w-full font-bold">
            Company name <span className="text-red-600">(optional)</span>
          </label>
          <input
            type="text"
            id="companyName"
            placeholder="Enter company name"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400"
            onChange={handleChangeTextFieldValues}
          />
          <small className="w-full"></small>
        </div>

        {/* national ID number form input field */}
        <div className="form-group w-full lg:w-1/2 p-5  ">
          <label htmlFor="nationalId" className="w-full font-bold">
            ID number <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="nationalId"
            placeholder="Enter national ID number"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400"
            onChange={(e) => {
              handleChangeTextFieldValues(e);
              markRequiredFormField(e.target);
            }}
          />
          <small className="w-full text-red-500">ID number is required!</small>
        </div>

        {/* national ID type form input field */}
        <div className="form-group w-full lg:w-1/2 p-5  ">
          <label htmlFor="idType" className="w-full font-bold">
            ID type <span className="text-red-600">*</span>
          </label>
          <select
            id="idType"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400"
            onChange={(e) => {
              handleChangeSelectFieldValues(e);
              markRequiredFormField(e.target);
            }}
          >
            <option value={""}>SELECT ID TYPE</option>
            {NATIONAL_ID_TYPE.map((type, index) => (
              <option key={index} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <small className="w-full text-red-500">ID type is required!</small>
        </div>

        {/*next of kin details */}
        <h1 className="w-full text-xl font-bold pt-10">Next of Kin</h1>

        {/* next of kin full name form input field */}
        <div className="form-group w-full p-5  ">
          <label htmlFor="fullName" className="w-full font-bold">
            Full name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            placeholder="Enter next of kin full name"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400"
            onChange={(e) => {
              markRequiredFormField(e.target);
              setTenant((prev) => ({
                ...prev,
                nextOfKin: { ...prev.nextOfKin, nokName: e.target.value },
              }));
            }}
          />
          <small className="w-full text-red-500">
            Next of kin full name is required!
          </small>
        </div>

        {/* next of kin email form input field */}
        <div className="form-group w-full lg:w-1/2 p-5  ">
          <label htmlFor="nokEmail" className="w-full font-bold">
            Email <span className="text-red-600">(optional)</span>
          </label>
          <input
            type="text"
            id="nokEmail"
            placeholder="Enter next of kin email"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400"
            onChange={(e) =>
              setTenant((prev) => ({
                ...prev,
                nextOfKin: { ...prev.nextOfKin, nokEmail: e.target.value },
              }))
            }
          />
          <small className="w-full"></small>
        </div>

        {/* next of kin telephone form input field */}
        <div className="form-group w-full lg:w-1/2 p-5  ">
          <label htmlFor="nokTelephone" className="w-full font-bold">
            Telephone (include country code eg. +1...){" "}
            <span className="text-red-600">*</span>
          </label>
          <input
            type="tel"
            id="nokTelephone"
            placeholder="Enter telephone (+158344)"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400"
            onChange={(e) => {
              markRequiredFormField(e.target);
              setTenant((prev) => ({
                ...prev,
                nextOfKin: { ...prev.nextOfKin, nokTelephone: e.target.value },
              }));
            }}
          />
          <small className="w-full text-red-500">
            Telephone number is required!
          </small>
        </div>

        {/* button for saving tenant */}
        <div className="form-group w-full py-10  flex justify-center items-center">
          <input
            type="submit"
            id="save-tenant"
            className="py-1 px-10 outline-none bg-blue-700 lg:hover:bg-blue-400 text-2xl text-white cursor-pointer"
            onClick={handleSaveTenantDetails}
          />
        </div>
      </div>
    </form>
  );
};

export default TenantDetailsForm;
