import React, { Suspense, useCallback, useEffect, useState } from "react";
import { FacilitiesModel } from "./FacilityModel";
import Amenity from "./Amenity";
import { FormatMoney, FormatMoneyExt } from "../../global/actions/formatMoney";
import { AmenityEnum } from "../../global/enums/amenityEnum";
import {
  BUSINESS_TYPE_DATA,
  FACILITY_RATING,
} from "../../global/PreDefinedData/PreDefinedData";
import { businessTypeEnum } from "../../global/enums/businessTypeEnum";
import { genderRestrictionEnum } from "../../global/enums/genderRestrictionEnum";
import FacilityForm from "./FacilityForm";
import ImagesForm from "../../global/forms/FacilityImagesForm";
import axios from "axios";
import { deleteData, fetchData, postData, putData } from "../../global/api";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { setAlert } from "../../other/alertSlice";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import { setConfirm } from "../../other/ConfirmSlice";
import { getAllUsers } from "../users/usersSlice";
import { UserRoleEnum } from "../../global/enums/userRoleEnum";
import { setUserAction } from "../../global/actions/actionSlice";
import { useNavigate } from "react-router-dom";
import { getCurrencyExchange } from "../../other/apis/CurrencyExchangeSlice";
import Maps from "../../global/Maps";
import { UserModel } from "../users/models/userModel";
import { updateFacility } from "./FacilitiesSlice";
import countriesList from "../../global/data/countriesList.json";

const ImageCarousel = React.lazy(() => import("../../global/ImageCarousel"));

interface Props {
  facility: FacilitiesModel;
}

const currentUser: UserModel = JSON.parse(
  localStorage.getItem("dnap-user") as string
);

let Details: React.FC<Props> = ({ facility }) => {
  const navigate = useNavigate();

  const [businessType, setBusinessType] = useState<{
    label: string;
    value: string;
  }>();

  const [isShowFacilityForm, setIsShowFacilityForm] = useState<boolean>(false);

  const [isShowImageForm, setIsShowImageForm] = useState<boolean>(false);

  const [facilityImages, setFacilityImages] = useState<
    { imageId: number; imageName: string }[]
  >([]);

  const [currencyNames, setCurrencyNames] = useState<string[]>([]);
  const [convertedPrice, setConvertedPrice] = useState<number>(0);
  const [desiredCurrency, setDesiredCurrency] = useState<string>("");

  const [openMap, setOpenMap] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: facility.facilityLocation.latitude
      ? Number(facility.facilityLocation.latitude)
      : 0,
    lng: facility.facilityLocation.longitude
      ? Number(facility.facilityLocation.longitude)
      : 0,
  });

  const [distance, setDistance] = useState(
    facility.facilityLocation.distance
      ? Number(facility.facilityLocation.distance)
      : 0
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const dispatch = useDispatch<AppDispatch>();

  const usersSate = useSelector(getAllUsers);
  const managers = usersSate.landlordUsers.filter(
    (user) => user.userRole === UserRoleEnum.manager
  );

  const currencyExchange = useSelector(getCurrencyExchange);

  // toggle open and close map
  const toggleOpenAndCloseMap = () => {
    setOpenMap(!openMap);
  };

  // set the currency names into an array
  useEffect(() => {
    const currencyNames = Object.keys(currencyExchange);
    setCurrencyNames(currencyNames);
  }, [currencyExchange]);

  // set the converted money
  useEffect(() => {
    setConvertedPrice(
      (Number(currencyExchange[desiredCurrency]) /
        Number(currencyExchange[facility.preferedCurrency])) *
        Number(facility.price)
    );
  }, [
    currencyExchange,
    desiredCurrency,
    facility.preferedCurrency,
    facility.price,
  ]);

  // set facility businessType
  useEffect(() => {
    setBusinessType(
      BUSINESS_TYPE_DATA.find((type) => type.value === facility.businessType)
    );
  }, [facility]);

  // toggle show and hide facility form
  const toggleShowFacilityForm = useCallback(
    () => setIsShowFacilityForm(!isShowFacilityForm),
    [isShowFacilityForm]
  );

  // handle fetch facility images
  useEffect(() => {
    const handleFetchFacilityImages = async () => {
      try {
        const result = await fetchData(
          `/fetch-facility-images/${Number(facility.facilityId)}`
        );

        if (result.data.status && result.data.status !== "OK") {
          console.log(result.data.message);
          return;
        }

        setFacilityImages(result.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("FETCH FACILITY IMAGES CANCELLED: ", error);
        }
      }
    };

    handleFetchFacilityImages();
  }, [facility.facilityId]);

  if (isShowFacilityForm)
    return <FacilityForm toggelIsAddFacility={toggleShowFacilityForm} />;

  if (isShowImageForm)
    return (
      <ImagesForm
        setIsShowImageForm={setIsShowImageForm}
        facility={{ facilityId: facility.facilityId }}
      />
    );

  // handle delete image
  const handleDeleteImage = async () => {
    let image_id: number = 0;

    if (facilityImages.length > 1) {
      image_id = Number(
        facilityImages.find((_, index) => index !== currentIndex)?.imageId
      );
    } else {
      image_id = Number(facilityImages[0].imageId);
    }

    try {
      const result = await deleteData(
        `/delete-facility-image/${Number(image_id)}/${Number(
          facility.facilityId
        )}`
      );

      if (result.data.status && result.data.status !== "OK") {
        dispatch(
          setAlert({
            type: AlertTypeEnum.danger,
            status: true,
            message: result.data.message,
          })
        );

        return;
      }

      setFacilityImages(
        facilityImages.filter((_, index) => index !== currentIndex)
      );

      dispatch(
        setAlert({
          type: AlertTypeEnum.success,
          status: true,
          message: result.data.message,
        })
      );
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("DELETE IMAGE FACILITY CANCELLED: ", error.message);
      }
    } finally {
      dispatch(setConfirm({ message: "", status: false }));
    }
  };

  // handle update and set facility location google map values
  const handleSetFacilityLocation = async () => {
    if (!navigator.geolocation) {
      dispatch(setConfirm({ status: false, message: "" }));
      dispatch(
        setAlert({
          status: true,
          type: AlertTypeEnum.danger,
          message: "Error getting location. Please try again",
        })
      );

      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        try {
          const result = await putData(
            `/update-google-map-location/${currentUser.userId}/${facility.facilityId}/${latitude}/${longitude}/${accuracy}`,
            {}
          );

          if (!result) {
            dispatch(
              setAlert({
                status: true,
                type: AlertTypeEnum.danger,
                message: "Error occurred please try again!",
              })
            );

            return;
          }

          if (result.data.status && result.data.status === 404) {
            dispatch(
              setAlert({
                status: true,
                type: AlertTypeEnum.danger,
                message: "Error occurred please try again!",
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

          dispatch(
            setAlert({
              status: true,
              type: AlertTypeEnum.success,
              message: result.data,
            })
          );

          setCoords({ lat: latitude, lng: longitude });

          setDistance(accuracy);
        } catch (error) {
          if (axios.isCancel(error)) {
            console.log(
              "UPDATE FACILITY LOCATION GOOGLE MAP VALUES CANCELLED: ",
              error.message
            );
          }
        } finally {
          dispatch(setConfirm({ status: false, message: "" }));
        }

        console.log(latitude, longitude, accuracy);
      });
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] lg:overflow-auto bg-gray-100">
      <div className="py-5 h-3/4 px-3">
        <Suspense fallback={<div>Loading...</div>}>
          <ImageCarousel
            setIsShowImageForm={setIsShowImageForm}
            facility={{ facilityId: facility.facilityId }}
            images={facilityImages}
            imageUrl={`${process.env.REACT_APP_FACILITY_IMAGES_URL}/${facility.facilityId}`}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            handleDeleteImage={handleDeleteImage}
          />
        </Suspense>
      </div>

      <div className="p-1 lg:p-y lg:pt-0 max-w-4xl mx-auto px-3">
        {/* facility rating  */}
        {facility.facilityRating && (
          <h3 className="pb-1 text-xl uppercase italic">
            <span>
              {
                FACILITY_RATING.find(
                  (rating) => rating.value === facility.facilityRating
                )?.label
              }
              {" Hotel"}
            </span>
          </h3>
        )}

        {/* facility name  */}
        <h1 className="w-full pt-5 text-3xl font-semi-bold">
          <span>{facility.facilityName}</span>
        </h1>
        <h3 className="pb-3 text-xl uppercase italic">
          <span>{businessType?.label} </span>
          {facility.businessType === businessTypeEnum.rent && (
            <span>
              {facility.genderRestriction === genderRestrictionEnum.both
                ? " (All gender)"
                : " (" + facility.genderRestriction + ")"}
            </span>
          )}

          {Number(facility.price) > 0 && (
            <span className="font-bold text-green-500">
              {" "}
              {FormatMoney(
                Number(facility.price),
                2,
                String(facility.preferedCurrency)
              )}
            </span>
          )}
        </h3>

        {openMap && (
          <Maps
            toggleOpenAndCloseMap={toggleOpenAndCloseMap}
            coords={coords}
            distance={distance}
          />
        )}
        <>
          {/* facility action button  */}
          <div className="w-full text-lg flex justify-start items-center">
            <button
              type="submit"
              className="py-1 px-2 lg:px-5 bg-blue-700 lg:hover:bg-blue-400 text-white mx-3"
              onClick={toggleShowFacilityForm}
            >
              Edit details
            </button>

            <button
              type="submit"
              className="py-1 px-2 lg:px-5 border-2 border-blue-500 text-blue-500 lg:hover:bg-blue-400 lg:hover:text-white mx-3 rounded-lg"
              onClick={() => {
                dispatch(
                  setUserAction({ userAction: handleSetFacilityLocation })
                );

                dispatch(
                  setConfirm({
                    status: true,
                    message: `Are you sure you want to update google maps for ${facility.facilityName} ${facility.facilityLocation.city} ${facility.facilityLocation.country}`,
                  })
                );
              }}
            >
              Update map
            </button>

            <button
              type="submit"
              className="py-1 px-2 lg:px-5 border-2 border-green-500 text-green-500 lg:hover:bg-green-400 lg:hover:text-white mx-3  rounded-lg"
              onClick={toggleOpenAndCloseMap}
            >
              View map
            </button>
            {/* <button
            type="submit"
            className="py-1 px-5 bg-red-700 lg:hover:bg-red-400 text-white mx-3 text-sm"
          >
            Delete
          </button> */}
          </div>
          <div className="w-full py-5">
            <p className="text-sm">{facility.description}</p>
          </div>
          <div className="flex flex-wrap justify-between items-start">
            <div className="w-full lg:w-1/3">
              {/*facility location*/}
              <div className="location py-4 w-full">
                <h2 className="text-xl font-bold text-gray-500 py-1">
                  Location
                </h2>
                {facility.facilityLocation.country && (
                  <p className="text-sm text-black">
                    <b>Country: </b>
                    <i>
                      {
                        countriesList.find(
                          (country) =>
                            country.value === facility.facilityLocation.country
                        )?.label
                      }
                    </i>
                  </p>
                )}

                {facility.facilityLocation.city && (
                  <p className="text-sm text-black">
                    <b>City: </b>
                    <i>{facility.facilityLocation.city}</i>
                  </p>
                )}

                {facility.facilityLocation.city && (
                  <p className="text-sm text-black">
                    <b>Primary address: </b>
                    <i>{facility.facilityLocation.primaryAddress}</i>
                  </p>
                )}
              </div>

              {/* contact */}
              <div className="location py-4 w-full">
                <h2 className="text-xl font-bold text-gray-500 py-1">
                  Contact
                </h2>
                {facility.contact.telephone1 && (
                  <p className="text-sm text-black">
                    <b>Telephone: </b>
                    <i>{facility.contact.telephone1}</i>
                  </p>
                )}

                {facility.contact.email && (
                  <p className="text-sm text-black">
                    <b>Email: </b>
                    <i>{facility.contact.email}</i>
                  </p>
                )}
              </div>

              {/* finance */}
              <div className="location py-4 w-full">
                <h2 className="text-xl font-bold text-gray-500 py-1">
                  Finance
                </h2>
                {facility.preferedCurrency && (
                  <p className="text-sm text-black">
                    <b>Prefered currency: </b>
                    <i>{facility.preferedCurrency}</i>
                  </p>
                )}

                {facility.preferedCurrency && (
                  <p className="text-sm text-black">
                    <b>Booking percentage: </b>
                    <i>{facility.bookingPercentage}%</i>
                  </p>
                )}

                {Number(facility.price) > 0 && (
                  <div className="text-sm text-black">
                    <b>Price: </b>
                    <select
                      name="currency"
                      id="currency"
                      className="uppercase py-0 bg-gray-300 rounded-md"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setDesiredCurrency(e.target.value)
                      }
                    >
                      <option value={facility.preferedCurrency}>
                        {facility.preferedCurrency}
                      </option>

                      {currencyNames.map((ex, index) => (
                        <option key={index} value={ex}>
                          {ex}
                        </option>
                      ))}
                    </select>{" "}
                    <i className="font-mono text-lg">
                      {FormatMoneyExt(
                        !desiredCurrency
                          ? Number(facility.price)
                          : Number(convertedPrice),
                        2,
                        !desiredCurrency
                          ? facility.preferedCurrency
                          : desiredCurrency
                      )}
                    </i>
                  </div>
                )}
              </div>

              {/* manager */}
              <div className="location py-4 w-full">
                <h2 className="text-xl font-bold text-gray-500 py-1">
                  Manager
                </h2>
                {facility.manager?.firstName && (
                  <p className="text-sm text-black">
                    <b>Name: </b>
                    <i>
                      {facility.manager?.firstName +
                        " " +
                        facility.manager?.lastName}
                    </i>
                  </p>
                )}

                {facility.manager?.userTelephone && (
                  <p className="text-sm text-black">
                    <b>Telephone: </b>
                    <i>{facility.manager?.userTelephone}</i>
                  </p>
                )}

                {facility.manager?.userEmail && (
                  <p className="text-sm text-black">
                    <b>Email: </b>
                    <i>{facility.manager?.userEmail}</i>
                  </p>
                )}

                <select
                  name=""
                  id=""
                  className="my-5 py-1 px-5 bg-gray-700 lg:hover:bg-gray-500 text-white rounded-lg cursor-pointer w-fit"
                  onChange={(e) => {
                    const manager = managers.find(
                      (manager) =>
                        Number(manager.userId) === Number(e.target.value)
                    );
                    // handle update facility manager
                    const handleUpdateFacilityManager = async () => {
                      try {
                        const result = await postData(`/set-facility-manager`, {
                          facility: facility,
                          manager: manager,
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

                        if (result.data.status && result.data.status !== "OK") {
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
                            message:
                              "Facility manager has been updated successfully!",
                          })
                        );

                        dispatch(
                          updateFacility({
                            id: Number(result.data.facility_id),
                            changes: result.data,
                          })
                        );

                        navigate("/facilities");
                      } catch (error) {
                        if (axios.isCancel(error)) {
                          console.log(
                            "SET FACILITY MANAGER CANCELLED: ",
                            error.message
                          );
                        }
                      } finally {
                        dispatch(setConfirm({ status: false, message: "" }));
                      }
                    };

                    dispatch(
                      setConfirm({
                        status: true,
                        message:
                          "Are you sure you want to change facility manager?",
                      })
                    );

                    dispatch(
                      setUserAction({ userAction: handleUpdateFacilityManager })
                    );
                  }}
                >
                  {facility.manager ? (
                    <option value={Number(facility.manager.userId)}>
                      CHANGE MANAGER
                    </option>
                  ) : (
                    <option value="">SELECT MANAGER</option>
                  )}

                  {managers.map((manager, index) => (
                    <option key={index} value={Number(manager.userId)}>
                      {"USR-" +
                        manager.userId +
                        ", " +
                        manager.firstName +
                        " " +
                        manager.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* facility amenities */}
            <div className="w-full lg:w-2/3">
              <div className="location py-4 w-full">
                <h2 className="text-xl font-bold text-gray-500">
                  Facility amenities
                </h2>
                <p className="flex justify-between text-center text-sm bg-black px-5 border-b-2 border-gray-300 text-blue-200 sticky top-0">
                  <b className="w-fit"></b>
                  <span className="w-1/2 flex justify-between text-center text-sm text-cyan-100 py-5">
                    <span className="text-center w-1/3">Availble</span>
                    <span className="text-center w-1/3">Free</span>
                    <span className="text-center w-1/3">Paid</span>
                  </span>
                </p>
                {facility.facilityAmenities && (
                  <Amenity
                    name="Parking"
                    availability={
                      !facility.facilityAmenities.parking
                        ? false
                        : facility.facilityAmenities.parking === AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility.facilityAmenities.parking}
                  />
                )}
                {facility.facilityAmenities && (
                  <Amenity
                    name="Water"
                    availability={
                      !facility.facilityAmenities.water
                        ? false
                        : facility.facilityAmenities.water === AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility.facilityAmenities.water}
                  />
                )}
                {facility.facilityAmenities && (
                  <Amenity
                    name="Electricity"
                    availability={
                      !facility.facilityAmenities.electricity
                        ? false
                        : facility.facilityAmenities.electricity ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility.facilityAmenities.electricity}
                  />
                )}
                {facility.facilityAmenities && (
                  <Amenity
                    name="wifi"
                    availability={
                      !facility.facilityAmenities.wifi
                        ? false
                        : facility.facilityAmenities.wifi === AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility.facilityAmenities.wifi}
                  />
                )}
                {facility.facilityAmenities && (
                  <Amenity
                    name="cable Internet"
                    availability={
                      !facility.facilityAmenities.cabelInternet
                        ? false
                        : facility.facilityAmenities.cabelInternet ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility.facilityAmenities.cabelInternet}
                  />
                )}
                {facility.facilityAmenities && (
                  <Amenity
                    name="elevator"
                    availability={
                      !facility.facilityAmenities.elevator ? false : true
                    }
                    amenity={facility.facilityAmenities.elevator}
                  />
                )}
                {facility.facilityAmenities && (
                  <Amenity
                    name="surveillance Cameras"
                    availability={
                      !facility.facilityAmenities.surveillanceCameras
                        ? false
                        : true
                    }
                    amenity={facility.facilityAmenities.surveillanceCameras}
                  />
                )}
                {facility.facilityAmenities && (
                  <Amenity
                    name="Security guard"
                    availability={
                      !facility.facilityAmenities.securityGuard ? false : true
                    }
                    amenity={facility.facilityAmenities.securityGuard}
                  />
                )}
                {facility.facilityAmenities && (
                  <Amenity
                    name="Fenced"
                    availability={
                      !facility.facilityAmenities.fenced ? false : true
                    }
                    amenity={facility.facilityAmenities.fenced}
                  />
                )}
                {facility.facilityAmenities && (
                  <Amenity
                    name="Wash Room"
                    availability={
                      !facility.facilityAmenities.washRoom
                        ? false
                        : facility.facilityAmenities.washRoom === AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility.facilityAmenities.washRoom}
                  />
                )}
                {facility.facilityAmenities && (
                  <Amenity
                    name="Airport Transport"
                    availability={
                      !facility.facilityAmenities.airportTransport
                        ? false
                        : facility.facilityAmenities.airportTransport ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility.facilityAmenities.airportTransport}
                  />
                )}
                {facility.facilityAmenities && (
                  <Amenity
                    name="gym"
                    availability={
                      !facility.facilityAmenities.gym
                        ? false
                        : facility.facilityAmenities.gym === AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility.facilityAmenities.gym}
                  />
                )}
                {facility.facilityAmenities && (
                  <Amenity
                    name="breakfast"
                    availability={
                      !facility.facilityAmenities.breakFast
                        ? false
                        : facility.facilityAmenities.breakFast ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility.facilityAmenities.breakFast}
                  />
                )}
                {facility.facilityAmenities && (
                  <Amenity
                    name="swimmingpool"
                    availability={
                      !facility.facilityAmenities.swimmingPool
                        ? false
                        : facility.facilityAmenities.swimmingPool ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility.facilityAmenities.swimmingPool}
                  />
                )}
                {facility.facilityAmenities && (
                  <Amenity
                    name="hostel Shuttle"
                    availability={
                      !facility.facilityAmenities.hostelShuttle
                        ? false
                        : facility.facilityAmenities.hostelShuttle ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility.facilityAmenities.hostelShuttle}
                  />
                )}
                {facility.facilityAmenities && (
                  <Amenity
                    name="conference Space"
                    availability={
                      !facility.facilityAmenities.conferenceSpace
                        ? false
                        : facility.facilityAmenities.conferenceSpace ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility.facilityAmenities.conferenceSpace}
                  />
                )}
                {facility.facilityAmenities && (
                  <Amenity
                    name="canteen"
                    availability={
                      !facility.facilityAmenities.canteen
                        ? false
                        : facility.facilityAmenities.canteen === AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility.facilityAmenities.canteen}
                  />
                )}
                {facility.facilityAmenities && (
                  <Amenity
                    name="clinic"
                    availability={
                      !facility.facilityAmenities.clinic
                        ? false
                        : facility.facilityAmenities.clinic === AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility.facilityAmenities.clinic}
                  />
                )}
                {facility.facilityAmenities && (
                  <Amenity
                    name="study Room"
                    availability={
                      !facility.facilityAmenities.studyRoom
                        ? false
                        : facility.facilityAmenities.studyRoom ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility.facilityAmenities.studyRoom}
                  />
                )}
                {facility.facilityAmenities && (
                  <Amenity
                    name="community Room"
                    availability={
                      !facility.facilityAmenities.communityRoom
                        ? false
                        : facility.facilityAmenities.communityRoom ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility.facilityAmenities.communityRoom}
                  />
                )}
                {facility.facilityAmenities && (
                  <Amenity
                    name="meeting Space"
                    availability={
                      !facility.facilityAmenities.meetingSpace
                        ? false
                        : facility.facilityAmenities.meetingSpace ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility.facilityAmenities.meetingSpace}
                  />
                )}
                {facility.facilityAmenities && (
                  <Amenity
                    name="events Space"
                    availability={
                      !facility.facilityAmenities.eventsSpace
                        ? false
                        : facility.facilityAmenities.eventsSpace ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility.facilityAmenities.eventsSpace}
                  />
                )}
                {facility.facilityAmenities && (
                  <Amenity
                    name="restaurant"
                    availability={
                      !facility.facilityAmenities.restaurant
                        ? false
                        : facility.facilityAmenities.restaurant ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility.facilityAmenities.restaurant}
                  />
                )}
                {facility.facilityAmenities && (
                  <Amenity
                    name="bar And Lounge"
                    availability={
                      !facility.facilityAmenities.barAndLounge
                        ? false
                        : facility.facilityAmenities.barAndLounge ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility.facilityAmenities.barAndLounge}
                  />
                )}
                {facility.facilityAmenities && (
                  <Amenity
                    name="standby Generator"
                    availability={
                      !facility.facilityAmenities.standByGenerator
                        ? false
                        : true
                    }
                    amenity={facility.facilityAmenities.standByGenerator}
                  />
                )}

                {facility.facilityAmenities && (
                  <Amenity
                    name="Air conditioner"
                    availability={
                      !facility.facilityAmenities.airConditioner ? false : true
                    }
                    amenity={facility.facilityAmenities.airConditioner}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

Details = React.memo(Details);

export default Details;
