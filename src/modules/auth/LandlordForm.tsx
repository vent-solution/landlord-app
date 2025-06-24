import React from "react";
import axios from "axios";
import { postData } from "../../global/api";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { setAlert } from "../../other/alertSlice";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import { ADDRESS_TYPE } from "../../global/PreDefinedData/PreDefinedData";
import { LandlordCreationModel } from "./landlordModel";
import AlertMessage from "../../other/alertMessage";
import countryList from "../../global/data/countriesList.json";
import checkRequiredFormFields from "../../global/validation/checkRequiredFormFields";

interface Props {
  landlord: LandlordCreationModel;
  setLandlord: React.Dispatch<React.SetStateAction<LandlordCreationModel>>;
}

const LandlordForm: React.FC<Props> = ({ landlord, setLandlord }) => {
  const dispatch = useDispatch<AppDispatch>();

  // check if can save landlord before saving
  const canSaveLandlord =
    Number(landlord.user?.userId) > 0 &&
    // String(landlord.idType).trim().length > 0 &&
    // String(landlord.nationalId).trim().length > 0 &&
    String(landlord.addressType).trim().length > 0 &&
    String(landlord.address?.country).trim().length > 0 &&
    String(landlord.address?.city).trim().length > 0;

  // handle change text field values
  const handleChangeTextFieldValues = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    setLandlord((prev) => ({ ...prev, [id]: value }));
  };

  // save user details
  const handleSaveLandlord = async () => {
    const idType = document.getElementById("idType") as HTMLInputElement;
    const nationalId = document.getElementById(
      "nationalId"
    ) as HTMLInputElement;
    const addressType = document.getElementById(
      "addressType"
    ) as HTMLInputElement;
    const country = document.getElementById("country") as HTMLInputElement;
    const city = document.getElementById("city") as HTMLInputElement;

    // check if all the required form fields are filled
    if (
      // !landlord.idType ||
      // landlord.idType.trim().length < 1 ||
      // !landlord.nationalId ||
      // landlord.nationalId.trim().length < 1 ||
      !landlord.addressType ||
      landlord.addressType.trim().length < 1 ||
      !landlord.address?.country ||
      landlord.address?.country.trim().length < 1 ||
      !landlord.address?.city ||
      landlord.address?.city.trim().length < 1
    ) {
      checkRequiredFormFields([idType, nationalId, addressType, country, city]);
    }

    // check if required landlord data values are provided
    if (!canSaveLandlord) {
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
      const result = await postData("/saveLandlord", landlord);

      if (!result) {
        dispatch(
          setAlert({
            status: true,
            type: AlertTypeEnum.danger,
            message: "ERROR OCCURRED PLEASE TRY AGAIN LATER!",
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

      window.location.href = `/landlord/${landlord.user?.userId}`;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("SAVE USER CANCELLED: ");
      }
    }
  };

  return (
    <div className="w-full bg-blue-950 flex flex-wrap px-2 lg:px-20">
      <div className="text-white w-full lg:w-1/3 p-3 lg:p-5  flex flex-wrap justify-center items-center h-fit lg:sticky top-32">
        <div className="w-full flex justify-start items-end">
          <img
            className="w-14 lg:w-20 h-14 lg:h-20"
            src="/landlord/images/logo-no-background.png"
            alt=""
          />
          <h1 className="text-3xl lg:text-5xl font-extrabold">ENT</h1>
        </div>
        <div className="text-gray-400 h-3/4 flex flex-wrap items-center justify-center w-full text-start py-10 lg:py-20 text-3xl">
          <div className="h-fit capitalize font-extralight">
            <p className="w-full">welcome to vent.</p>
            <p className="w-full">
              the World's number one real-estate solution.
            </p>
          </div>
        </div>
        <h1 className="text-xs w-full text-start">&copy; vent solutions</h1>
      </div>

      <form
        className="p-5 text-lg lg:text-sm  w-full lg:w-2/3 m-auto text-white bg-white bg-opacity-10"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}
      >
        <h1 className="w-full text-2xl font-bold p-10">
          Complete your landlord profile
        </h1>
        <div className="flex flex-wrap justify-between w-full">
          {/* company name form input field */}
          <div className="form-group w-full p-5  shadow-lg">
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

          {/* ID form input field */}
          {/* <div className="form-group w-full lg:w-1/2 p-5  shadow-lg">
            <label htmlFor="nationalId" className="w-full font-bold">
              ID number <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="nationalId"
              placeholder="Enter ID number"
              className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400"
              onChange={(e) =>
                setLandlord((prev) => ({
                  ...prev,
                  nationalId: e.target.value,
                }))
              }
            />
            <small className="w-full text-red-200">
              ID number is required!
            </small>
          </div> */}

          {/* ID type form input field */}
          {/* <div className="form-group w-full lg:w-1/2 p-5  shadow-lg">
            <label htmlFor="idType" className="w-full font-bold">
              ID type<span className="text-red-600">*</span>
            </label>
            <select
              id="idType"
              className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400"
              onChange={(e) =>
                setLandlord((prev) => ({
                  ...prev,
                  idType: e.target.value,
                }))
              }
            >
              <option value="">SELECT ID TYPE</option>

              {NATIONAL_ID_TYPE.map((type, index) => (
                <option key={index} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <small className="w-full text-red-200">ID type is required</small>
          </div> */}

          {/* address */}
          <h1 className="text-lg font-bold pt-5 w-full">Address</h1>

          {/* address type form input field */}
          <div className="form-group w-full lg:w-1/2 p-5  shadow-lg">
            <label htmlFor="addressType" className="w-full font-bold">
              Address type <span className="text-red-600">*</span>
            </label>
            <select
              id="addressType"
              className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400"
              onChange={(e) =>
                setLandlord((prev) => ({
                  ...prev,
                  addressType: e.target.value,
                }))
              }
            >
              <option value="">SELECT ADDRESS TYPE</option>

              {ADDRESS_TYPE.map((type, index) => (
                <option key={index} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <small className="w-full text-red-200">
              Address type is required!
            </small>
          </div>

          {/* country form input field */}
          <div className="form-group w-full lg:w-1/2 p-5  shadow-lg">
            <label htmlFor="country" className="w-full font-bold">
              Country <span className="text-red-600">*</span>
            </label>

            <select
              name="country"
              id="country"
              className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400"
              onChange={(e) =>
                setLandlord((prev) => ({
                  ...prev,
                  address: {
                    ...prev.address,
                    country: e.target.value,
                  },
                }))
              }
            >
              <option value="">SELECT COUNTRY</option>
              {countryList.map((country) => (
                <option value={country.value}>{country.label}</option>
              ))}
            </select>
            <small className="w-full text-red-200"> Country is required!</small>
          </div>

          {/* state form input field */}
          {/* <div className="form-group w-full lg:w-1/2 p-5  shadow-lg">
            <label htmlFor="state" className="w-full font-bold">
              State <span className="text-red-600"></span>
            </label>
            <input
              type="text"
              id="state"
              placeholder="Enter next of kin state"
              className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400"
              onChange={(e) =>
                setLandlord((prev) => ({
                  ...prev,
                  address: {
                    ...prev.address,
                    state: e.target.value,
                  },
                }))
              }
            />
            <small className="w-full"></small>
          </div> */}

          {/* city form input field */}
          <div className="form-group w-full lg:w-1/2 p-5  shadow-lg">
            <label htmlFor="city" className="w-full font-bold">
              City/Municipality/District <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="city"
              placeholder="Enter next of kin city"
              className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400"
              onChange={(e) =>
                setLandlord((prev) => ({
                  ...prev,
                  address: {
                    ...prev.address,
                    city: e.target.value,
                  },
                }))
              }
            />
            <small className="w-full text-red-200">
              City/district/municipality is required!
            </small>
          </div>

          {/* next of kin county form input field */}
          {/* <div className="form-group w-full lg:w-1/2 p-5  shadow-lg">
            <label htmlFor="county" className="w-full font-bold">
              County <span className="text-red-600"></span>
            </label>
            <input
              type="text"
              id="county"
              placeholder="Enter next of kin county"
              className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400"
              onChange={(e) =>
                setLandlord((prev) => ({
                  ...prev,
                  address: {
                    ...prev.address,
                    county: e.target.value,
                  },
                }))
              }
            />
            <small className="w-full"></small>
          </div> */}

          {/* division form input field */}
          {/* <div className="form-group w-full lg:w-1/2 p-5  shadow-lg">
            <label htmlFor="division" className="w-full font-bold">
              Division / Sub county <span className="text-red-600"></span>
            </label>
            <input
              type="text"
              id="division"
              placeholder="Enter next of kin division"
              className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400"
              onChange={(e) =>
                setLandlord((prev) => ({
                  ...prev,
                  address: {
                    ...prev.address,
                    division: e.target.value,
                  },
                }))
              }
            />
            <small className="w-full"></small>
          </div> */}

          {/* parish form input field */}
          {/* <div className="form-group w-full lg:w-1/2 p-5  shadow-lg">
            <label htmlFor="parish" className="w-full font-bold">
              Parish / Ward <span className="text-red-600"></span>
            </label>
            <input
              type="text"
              id="parish"
              placeholder="Enter next of kin parish"
              className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400"
              onChange={(e) =>
                setLandlord((prev) => ({
                  ...prev,
                  address: {
                    ...prev.address,
                    parish: e.target.value,
                  },
                }))
              }
            />
            <small className="w-full"></small>
          </div> */}

          {/* zone form input field */}
          {/* <div className="form-group w-full lg:w-1/2 p-5  shadow-lg">
            <label htmlFor="zone" className="w-full font-bold">
              Zone / Village / LC1 <span className="text-red-600"></span>
            </label>
            <input
              type="text"
              id="zone"
              placeholder="Enter next of kin zone"
              className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400"
              onChange={(e) =>
                setLandlord((prev) => ({
                  ...prev,
                  address: {
                    ...prev.address,
                    zone: e.target.value,
                  },
                }))
              }
            />
            <small className="w-full"></small>
          </div> */}

          {/* street form input field */}
          {/* <div className="form-group w-full lg:w-1/2 p-5  shadow-lg">
            <label htmlFor="street" className="w-full font-bold">
              Street <span className="text-red-600"></span>
            </label>
            <input
              type="text"
              id="street"
              placeholder="Enter next of kin street"
              className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400"
              onChange={(e) =>
                setLandlord((prev) => ({
                  ...prev,
                  address: {
                    ...prev.address,
                    street: e.target.value,
                  },
                }))
              }
            />
            <small className="w-full"></small>
          </div> */}

          {/* plotNumber form input field */}
          {/* <div className="form-group w-full lg:w-1/2 p-5  shadow-lg">
            <label htmlFor="plotNumber" className="w-full font-bold">
              Plot Number <span className="text-red-600"></span>
            </label>
            <input
              type="text"
              id="plotNumber"
              placeholder="Enter next of kin plotNumber"
              className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400"
              onChange={(e) =>
                setLandlord((prev) => ({
                  ...prev,
                  address: {
                    ...prev.address,
                    plotNumber: e.target.value,
                  },
                }))
              }
            />
            <small className="w-full"></small>
          </div> */}

          {/* button for saving tenant */}
          <div className="form-group w-full py-10 shadow-lg flex justify-center items-center">
            <input
              type="submit"
              id="save-tenant"
              className="py-1 px-10 outline-none bg-blue-700 lg:hover:bg-blue-400 text-2xl text-white cursor-pointer"
              onClick={handleSaveLandlord}
            />
          </div>
        </div>
        <AlertMessage />
      </form>
    </div>
  );
};

export default LandlordForm;
