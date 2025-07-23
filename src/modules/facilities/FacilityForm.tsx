import React, { useCallback, useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { facilityCategory } from "../../global/enums/facilityCategory";
import { genderRestrictionEnum } from "../../global/enums/genderRestrictionEnum";
import { currencyNames } from "../../other/apis/CurrencyName";
import "react-phone-input-2/lib/style.css";
import { CreationFacilitiesModel } from "./FacilityModel";
import markRequiredFormField from "../../global/validation/markRequiredFormField";
import AddressForm from "../../global/forms/AddressForm";
import ContactForm from "../../global/forms/ContactForm";
import { AmenitiesModel } from "./AmenitiesModel";
import AmenitiesForm from "../../global/forms/AmenitiesForm";
import { AmenityEnum } from "../../global/enums/amenityEnum";
import axios from "axios";
import { postData, putData } from "../../global/api";
import { setAlert } from "../../other/alertSlice";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import { UserModel } from "../users/models/userModel";
import { UserRoleEnum } from "../../global/enums/userRoleEnum";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
  BUSINESS_TYPE_DATA,
  FACILITY_CATEGORY_DATA,
  FACILITY_RATING,
  FACILITY_STATUS,
  GENDER_RESTRICTION_DATA,
} from "../../global/PreDefinedData/PreDefinedData";
import { businessTypeEnum } from "../../global/enums/businessTypeEnum";
import { useNavigate, useParams } from "react-router-dom";
import { addNewFacility, findFacilityById } from "./FacilitiesSlice";
import { setConfirm } from "../../other/ConfirmSlice";
import { setUserAction } from "../../global/actions/actionSlice";
import checkRequiredFormFields from "../../global/validation/checkRequiredFormFields";

interface Props {
  toggelIsAddFacility: () => void;
}

const INITIAL_FACILITY_DATA: CreationFacilitiesModel = {
  landlord: {
    landlordId: null,
  },
  facilityCategory: null,
  facilityName: null,
  facilityLocation: {},
  contact: {
    telephone1: null,
    email: null,
  },
  genderRestriction: genderRestrictionEnum.both,
  businessType: null,
  preferedCurrency: null,
  price: null,
  bookingPercentage: null,
  facilityRating: null,
  facilityStatus: null,
};

const INITIAL_FACILITY_AMENITIES = {
  facility: { facilityId: 0 },
  parking: AmenityEnum.no,
  water: AmenityEnum.no,
  electricity: AmenityEnum.no,
  wifi: AmenityEnum.no,
  cabelInternet: AmenityEnum.no,
  standByGenerator: false,
  elevator: false,
  surveillanceCameras: false,
  securityGuard: false,
  fenced: false,
  washRoom: AmenityEnum.no,
  airportTransport: AmenityEnum.no,
  gym: AmenityEnum.no,
  breakFast: AmenityEnum.no,
  swimmingPool: AmenityEnum.no,
  hostelShuttle: AmenityEnum.no,
  conferenceSpace: AmenityEnum.no,
  canteen: AmenityEnum.no,
  clinic: AmenityEnum.no,
  studyRoom: AmenityEnum.no,
  communityRoom: AmenityEnum.no,
  meetingSpace: AmenityEnum.no,
  eventsSpace: AmenityEnum.no,
  restaurant: AmenityEnum.no,
  barAndLounge: AmenityEnum.no,
  airConditioner: false,
  facilityStatus: null,
};

const INITIAL_ADDRESS = {
  primaryAddress: null,
  country: null,
  city: null,
};

let FacilityForm: React.FC<Props> = ({ toggelIsAddFacility }) => {
  const [facilityCategories] = useState<{ label: string; value: string }[]>(
    FACILITY_CATEGORY_DATA
  );

  const [businessTypes] =
    useState<{ label: string; value: string }[]>(BUSINESS_TYPE_DATA);

  const [genderRestrictions] = useState<{ label: string; value: string }[]>(
    GENDER_RESTRICTION_DATA
  );

  const currencyArray = Object.entries(currencyNames).map(([code, name]) => ({
    code,
    name,
  }));

  const [facilityData, setFacilityData] = useState<CreationFacilitiesModel>(
    INITIAL_FACILITY_DATA
  );

  const [amenities, setAmenities] = useState<AmenitiesModel>(
    INITIAL_FACILITY_AMENITIES
  );

  const [address, setAddress] = useState<{
    primaryAddress: string | null;
    country: string | null;
    city: string | null;
  }>(INITIAL_ADDRESS);

  const { facilityId } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const selectedFacility = useSelector(findFacilityById(Number(facilityId)));

  const canSave =
    facilityData.facilityCategory &&
    facilityData.businessType &&
    facilityData.bookingPercentage &&
    facilityData.facilityName &&
    facilityData.preferedCurrency &&
    facilityData.facilityStatus &&
    facilityData.facilityLocation.city &&
    facilityData.facilityLocation.country;

  // set selected facility on updating facility data
  useEffect(() => {
    const facility = selectedFacility;
    if (facilityId) {
      setFacilityData((prev) => ({
        ...prev,
        facilityCategory: String(facility?.facilityCategory),
        businessType: String(facility?.businessType),
        price: Number(facility?.price),
        facilityName: String(facility?.facilityName),
        preferedCurrency: String(facility?.preferedCurrency),
        genderRestriction: String(facility?.genderRestriction),
        description: String(facility?.description),
        facilityLocation: { ...facility?.facilityLocation },
        contact: { ...facility?.contact },
        facilityAmenities: facility?.facilityAmenities,
        facilityRating: facility?.facilityRating,
        bookingPercentage: Number(facility?.bookingPercentage),
      }));

      setAmenities((prev) => ({ ...prev, ...facility?.facilityAmenities }));
    }
  }, [facilityId, selectedFacility]);

  // set facility location
  useEffect(() => {
    setFacilityData((prev) => ({ ...prev, facilityLocation: address }));
  }, [address]);

  // set landlord ID
  useEffect(() => {
    let landlordId: number;
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    if (currentUser.userRole === UserRoleEnum.landlord) {
      landlordId = Number(currentUser.userId);
    } else {
      landlordId = Number(currentUser.linkedTo);
    }
    setFacilityData((prev) => ({
      ...prev,
      landlord: { landlordId: landlordId },
    }));
  }, []);

  // handle form field change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setFacilityData({ ...facilityData, [id]: value });
    markRequiredFormField(e.target);
  };

  // handle save facility button clicked
  const handleSaveFacility = async () => {
    console.log(facilityData);

    if (!canSave) {
      // check required form input fields
      checkRequiredFormFields([
        document.getElementById("bookingPercentage") as HTMLInputElement,
        document.getElementById("facilityName") as HTMLInputElement,
        document.getElementById("city") as HTMLInputElement,
        document.getElementById("telephone1") as HTMLInputElement,
        document.getElementById("email") as HTMLInputElement,
        document.getElementById("country") as HTMLInputElement,
        document.getElementById("primaryAddress") as HTMLInputElement,
      ]);

      // check required form select fields
      checkRequiredFormFields([
        document.getElementById("facilityCategory") as HTMLSelectElement,
        document.getElementById("businessType") as HTMLSelectElement,
        document.getElementById("preferedCurrency") as HTMLSelectElement,
        document.getElementById("facilityStatus") as HTMLSelectElement,
      ]);

      dispatch(
        setAlert({
          type: AlertTypeEnum.danger,
          status: true,
          message: "Please fill all required fields marked by *",
        })
      );
      return;
    }

    try {
      const result = await postData(`/save-new-facility`, {
        facility: facilityData,
        amenities: amenities,
      });

      if (!result) {
        dispatch(
          setAlert({
            type: AlertTypeEnum.danger,
            status: true,
            message: "INTERNAL SERVER ERROR!",
          })
        );
        return;
      }

      if (
        result.status !== 200 ||
        (result.data.status && result.data.status !== "OK")
      ) {
        dispatch(
          setAlert({
            type: AlertTypeEnum.danger,
            status: true,
            message: result.data.message,
          })
        );
        return;
      }

      dispatch(
        setAlert({
          type: AlertTypeEnum.success,
          status: true,
          message: "Facility has been added successfully!",
        })
      );

      dispatch(addNewFacility(result.data));
      toggelIsAddFacility();
      navigate("/facilities");
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("SAVE FACILITY CANCELLED: ", error.message);
      }
    }
  };

  // handle update facility button clicked
  const handleUpdateFacility = useCallback(async () => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    try {
      const result = await putData(
        `/edit-facility/${Number(currentUser.userId)}/${Number(facilityId)}`,
        {
          facility: facilityData,
          amenities: amenities,
        }
      );

      if (!result || result.status === 404) {
        dispatch(
          setAlert({
            message: "Server error. Please try again!",
            status: true,
            type: AlertTypeEnum.danger,
          })
        );

        return;
      }

      if (result.data.status && result.data.status !== "OK") {
        dispatch(
          setAlert({
            message: result.data.message,
            status: true,
            type: AlertTypeEnum.danger,
          })
        );

        return;
      }

      dispatch(
        setAlert({
          message: result.data.message,
          status: true,
          type: AlertTypeEnum.success,
        })
      );

      toggelIsAddFacility();
      navigate("/facilities");
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("UPDATE FACILITY CANCELLED: ", error.message);
      }
    } finally {
      dispatch(setConfirm({ message: "", status: false }));
    }
  }, [
    amenities,
    facilityData,
    facilityId,
    dispatch,
    toggelIsAddFacility,
    navigate,
  ]);

  return (
    <div className="w-full overflow-auto h-[calc(100vh-90px)] pt-0 px-2 lg:px-5 py-10">
      <div className="w-full lg:w-5/6 m-auto h-fit mt-1 shadow-lg relative bg-gray-50">
        <div className="w-full py-2 px-2 flex justify-between items-center bg-white shadow-lg sticky top-0">
          <h1 className="w-5/6 text-center text-2xl font-light tracking-wider">
            {facilityId ? "Update facility info" : "Add new facility"}
          </h1>
          <h1
            className="text-3xl p-1  hover:bg-red-500 cursor-pointer font-bold"
            onClick={toggelIsAddFacility}
          >
            <RxCross2 />
          </h1>
        </div>
        <div className="w-full p-5 flex flex-wrap justify-start text-sm">
          <h1 className="font-bold text-xl w-full p-5 text-blue-800 border-b-2 border-blue-800">
            Facility details
          </h1>
          {/* facility category select field */}
          <div className="form-group w-full lg:w-1/3 px-4 py-0 my-2 lg:mx-0">
            <label htmlFor="facilityCategory" className="font-bold">
              Facility category
              <span className="tex-red-500">*</span>
            </label>

            <select
              name=""
              id="facilityCategory"
              className="w-full  outline-none border border"
              onChange={(e) => {
                handleChange(e);
                markRequiredFormField(e.target);
              }}
            >
              <option
                value={
                  facilityData.facilityCategory &&
                  facilityData.facilityCategory.trim().length > 0
                    ? facilityData.facilityCategory
                    : ""
                }
                className="uppercase"
              >
                {facilityData.facilityCategory
                  ? FACILITY_CATEGORY_DATA.find(
                      (category) =>
                        category.value === facilityData.facilityCategory
                    )?.label
                  : "SELECT CATEGORY"}
              </option>
              {facilityCategories.map((category, index) => (
                <option
                  key={index}
                  value={category.value}
                  className="capitalize"
                >
                  {category.label}
                </option>
              ))}
            </select>
            <small className="text-red-600 w-full">
              Facility category is required!
            </small>
          </div>

          {/* facility rating select field */}
          {facilityData.facilityCategory === facilityCategory.hotel && (
            <div className="form-group w-full lg:w-1/3 px-4 py-0 my-2 lg:mx-0">
              <label htmlFor="facilityRating" className="font-bold">
                Rating
                <span className="tex-red-500">*</span>
              </label>

              <select
                name=""
                id="facilityRating"
                className="w-full  outline-none border"
                onChange={(e) => {
                  handleChange(e);
                  markRequiredFormField(e.target);
                }}
              >
                <option
                  value={
                    facilityData.facilityRating
                      ? facilityData.facilityRating
                      : ""
                  }
                  className="uppercase"
                >
                  {facilityData.facilityRating
                    ? FACILITY_RATING.find(
                        (rating) => rating.value === facilityData.facilityRating
                      )?.label
                    : "SELECT RATING"}
                </option>
                {FACILITY_RATING.map((rating, index) => (
                  <option
                    key={index}
                    value={rating.value}
                    className="capitalize"
                  >
                    {rating.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* business type select field */}
          <div className="form-group w-full lg:w-1/3 px-4 py-0 my-2 lg:mx-0">
            <label htmlFor="businessType" className="font-bold">
              {" "}
              Business type
              <span className="tex-red-500">*</span>
            </label>
            <select
              name=""
              id="businessType"
              className="w-full  outline-none border"
              onChange={(e) => {
                handleChange(e);
                markRequiredFormField(e.target);
              }}
            >
              <option
                value={
                  facilityData.businessType ? facilityData.businessType : ""
                }
                className="uppercase text-gray-600"
              >
                {facilityData.businessType
                  ? BUSINESS_TYPE_DATA.find(
                      (type) => type.value === facilityData.businessType
                    )?.label
                  : "SELECT BUSINESS"}
              </option>
              {businessTypes.map((business, index) => (
                <option
                  key={index}
                  value={business.value}
                  className="capitalize"
                >
                  {business.label}
                </option>
              ))}
            </select>

            <small className="text-red-600 w-full">
              Business type is required
            </small>
          </div>

          {/* price */}
          {(facilityData.businessType === businessTypeEnum.sale ||
            facilityData.businessType === businessTypeEnum.rentWhole) && (
            <div className="form-group w-full lg:w-1/3 px-4 py-0 my-2 lg:mx-0">
              <label htmlFor="facilityCategory" className="font-bold">
                Price <span className="tex-red-500">*</span>
              </label>

              <input
                type="number"
                name=""
                id="price"
                value={facilityData.price || ""}
                placeholder="$.0"
                className="w-full  outline-none border"
                onChange={(e) =>
                  setFacilityData((prev) => ({
                    ...prev,
                    price: Number(e.target.value),
                  }))
                }
              />
            </div>
          )}

          {/*booking percentage */}
          <div className="form-group w-full lg:w-1/3 px-4 py-0 my-2 lg:mx-0">
            <label htmlFor="bookingPercentage" className="font-bold">
              Booking percentage <span className="tex-red-500">*</span>
            </label>
            <input
              type="number"
              name=""
              id="bookingPercentage"
              value={Number(facilityData.bookingPercentage) || ""}
              placeholder="Enter percentage (eg. 200)"
              className="w-full  outline-none border"
              onChange={(e) => {
                setFacilityData((prev) => ({
                  ...prev,
                  bookingPercentage: Number(e.target.value),
                }));
                markRequiredFormField(e.target);
              }}
            />

            <small className="w-full text-red-600">
              Booking percentage is required!{" "}
            </small>
          </div>

          {/* facility name text field */}
          <div className="form-group w-full px-4 py-0 my-2 lg:mx-0">
            <label htmlFor="facilityName" className="font-bold">
              Facility name
              <span className="tex-red-500">*</span>
            </label>
            <input
              type="text"
              id="facilityName"
              value={String(facilityData.facilityName || "")}
              placeholder="Enter facility name"
              className="w-full outline-none border"
              onChange={(e) => {
                handleChange(e);
                markRequiredFormField(e.target);
              }}
            />

            <small className="w-full text-red-600">
              Facility name is required!
            </small>
          </div>

          {/* preferred currency */}
          <div className="form-group w-full lg:w-1/3 px-4 py-0 my-2 lg:mx-0">
            <label htmlFor="preferedCurrency" className="font-bold">
              Preferred currency <span className="tex-red-500">*</span>
            </label>
            <select
              name=""
              id="preferedCurrency"
              value={facilityData.preferedCurrency || ""}
              className="w-full  outline-none border"
              onChange={(e) => {
                handleChange(e);
                markRequiredFormField(e.target);
              }}
            >
              <option value={""} className="uppercase">
                SELECT CURRENCY
              </option>
              {currencyArray.map((currency) => (
                <option value={currency.code} className="capitalize">
                  {currency.code + ": " + currency.name}
                </option>
              ))}
            </select>

            <small className="w-full text-red-600">
              Preferred currency is required!
            </small>
          </div>

          {/* Gender restriction */}
          <div className="form-group w-full lg:w-1/3 px-4 py-0 my-2 lg:mx-0">
            <label htmlFor="genderRestriction" className="font-bold">
              Gender restriction <span className="tex-red-500"></span>
            </label>
            <select
              name=""
              id="genderRestriction"
              value={facilityData.genderRestriction || ""}
              className="w-full  outline-none border"
              onChange={handleChange}
            >
              <option value={genderRestrictionEnum.both} className="uppercase">
                SELECT GENDER
              </option>
              {genderRestrictions.map((gender) => (
                <option value={gender.value} className="capitalize">
                  {gender.label}
                </option>
              ))}
            </select>
          </div>

          {/* facility status */}
          <div className="form-group w-full lg:w-1/3 px-4 py-0 my-2 lg:mx-0">
            <label htmlFor="facilityStatus" className="font-bold">
              Facility status <span className="tex-red-500">*</span>
            </label>
            <select
              name="facilityStatus"
              id="facilityStatus"
              value={facilityData.facilityStatus || ""}
              className="w-full  outline-none border"
              onChange={(e) => {
                handleChange(e);
                markRequiredFormField(e.target);
              }}
            >
              <option value={""} className="uppercase">
                SELECT STATUS
              </option>
              {FACILITY_STATUS.map((status) => (
                <option value={status.value} className="capitalize">
                  {status.label}
                </option>
              ))}
            </select>
            <small className="w-full text-red-600">
              Facility status is required!
            </small>
          </div>

          {/* Facility description text area */}
          <div className="form-group w-full lg:w-full px-4 py-0 my-2 lg:mx-0">
            <label htmlFor="description" className="font-bold">
              More description <span className="tex-red-500"></span>
            </label>

            <textarea
              name="description"
              id="description"
              rows={12}
              maxLength={5000}
              value={
                (facilityData.description !== "null" &&
                  facilityData.description) ||
                ""
              }
              placeholder="Add more preferred details about the facility up to 5000 characters"
              className="w-full p-3 resize-none outline-none border"
              onChange={handleChange}
            ></textarea>
          </div>

          <h1 className="font-bold text-xl w-full p-5 text-blue-800 border-b-2 border-blue-800">
            Facility Location
          </h1>

          <AddressForm facilityData={facilityData} setAddress={setAddress} />

          <h1 className="font-bold text-xl w-full p-5 text-blue-800 border-b-2 border-blue-800">
            Contact
          </h1>

          <ContactForm setData={setFacilityData} data={facilityData} />

          <h1 className="font-bold text-xl w-full p-5 text-blue-800 border-b-2 border-blue-800">
            Amenities
          </h1>

          <AmenitiesForm
            setAmenities={setAmenities}
            amenities={amenities}
            facilityData={facilityData}
          />
        </div>
        {!facilityId ? (
          <div className="w-full flex justify-center items-center py-0">
            <button
              className="p-3 w-1/4 bg-blue-600 text-white text-xl hover:bg-blue-400 active:w-1/5"
              onClick={handleSaveFacility}
            >
              Save
            </button>
          </div>
        ) : (
          <div className="w-full flex justify-center items-center py-0">
            <button
              className="p-3 w-1/4 bg-blue-600 text-white text-xl hover:bg-blue-400 active:w-1/5"
              onClick={() => {
                dispatch(
                  setConfirm({
                    message: `Are you sure you want to update facility (FAC-${facilityId}, ${facilityData.facilityName}) ?`,
                    status: true,
                  })
                );

                dispatch(setUserAction({ userAction: handleUpdateFacility }));
              }}
            >
              Update
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

FacilityForm = React.memo(FacilityForm);
export default FacilityForm;
