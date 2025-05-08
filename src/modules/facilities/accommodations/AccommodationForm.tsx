import React, { useCallback, useEffect, useRef, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { FacilitiesModel } from "../FacilityModel";
import {
  ACCOMMODATION_CATEGORY,
  ACCOMMODATION_TYPE_DATA,
  GENDER_RESTRICTION_DATA,
  PAYMENT_PARTERN,
  ROOM_LOCATION_DATA,
} from "../../../global/PreDefinedData/PreDefinedData";
import { facilityCategory } from "../../../global/enums/facilityCategory";
import { AccommodationType } from "../../../global/enums/accommodationType";
import { AccommodationCreationModel } from "./AccommodationModel";
import axios from "axios";
import { postData, putData } from "../../../global/api";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { setAlert } from "../../../other/alertSlice";
import { AlertTypeEnum } from "../../../global/enums/alertTypeEnum";
import { useSearchParams } from "react-router-dom";
import {
  addAccommodation,
  getAccommodationById,
  updateAccommodation,
} from "./accommodationsSlice";
import { setConfirm } from "../../../other/ConfirmSlice";
import { setUserAction } from "../../../global/actions/actionSlice";
import markRequiredFormField from "../../../global/validation/markRequiredFormField";
import { SocketMessageModel } from "../../../webSockets/SocketMessageModel";
import { UserModel } from "../../users/models/userModel";
import { UserActivity } from "../../../global/enums/userActivity";
import { webSocketService } from "../../../webSockets/socketService";

interface Props {
  facility: FacilitiesModel;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  selectedType:
    | {
        label: string;
        values: string;
      }
    | undefined;

  setSelectedType: React.Dispatch<
    React.SetStateAction<
      | {
          label: string;
          values: string;
        }
      | undefined
    >
  >;

  toggleShowAccommodationDetails: () => void;
}

const INITIAL_ACCOMMODATION_DATA: AccommodationCreationModel = {
  accommodationNumber: null,
  floor: null,
  price: null,
  bedrooms: null,
  fullyFurnished: false,
  selfContained: false,
  accommodationCategory: null,
  accommodationType: null,
  genderRestriction: null,
  capacity: 1,
  paymentPartten: null,
  roomLocation: null,
  numberOfwashRooms: null,
  facility: { facilityId: 0 },
  description: null,
};

const currentUser: UserModel = JSON.parse(
  localStorage.getItem("dnap-user") as string
);

const AccommodationForm: React.FC<Props> = ({
  setShowForm,
  selectedType,
  facility,
  setSelectedType,
}) => {
  const [searchParams] = useSearchParams();
  const accommodationId = searchParams.get("unit_id");

  const focusOnSave = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch<AppDispatch>();

  const currentAccommodation = useSelector(
    getAccommodationById(Number(accommodationId))
  );

  const [accommodation, setAccommodation] =
    useState<AccommodationCreationModel>({
      ...INITIAL_ACCOMMODATION_DATA,
      accommodationType: String(selectedType?.values),
    });

  // set selected accommodationType and the accommodation type
  useEffect(() => {
    currentAccommodation?.accommodationType &&
      setSelectedType({
        label: String(
          ACCOMMODATION_TYPE_DATA.find(
            (type) => type.value === currentAccommodation?.accommodationType
          )?.label
        ),
        values: String(currentAccommodation?.accommodationType),
      });

    !currentAccommodation?.accommodationType &&
      setTimeout(() => {
        setAccommodation((prev) => ({
          ...prev,
          accommodationType: String(selectedType?.values),
        }));
      }, 1000);
  }, [currentAccommodation, setSelectedType, selectedType]);

  // set accommodation facility
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAccommodation((prev) => ({
        ...prev,
        facility: { facilityId: facility.facilityId },
        // accommodationType: String(selectedType?.values),
      }));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [facility, selectedType?.values]);

  // handle change text field
  const handelChangeTextField = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;

      setAccommodation((prev) => ({ ...prev, [id]: value }));
    },
    []
  );

  // handle change text area
  const handelChangeTextArea = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { id, value } = e.target;

      setAccommodation((prev) => ({ ...prev, [id]: value }));
    },
    []
  );

  // handle change select option
  const handelChangeSelectField = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { id, value } = e.target;

      setAccommodation((prev) => ({ ...prev, [id]: value }));
    },
    []
  );

  // handle clear form and change cursor focus after saving
  const handleClearForm = useCallback(() => {
    setAccommodation(INITIAL_ACCOMMODATION_DATA);
    if (focusOnSave.current) {
      focusOnSave.current.focus();
    }
  }, []);

  // handle save new accommodation
  const saveNewAccommodation = useCallback(async () => {
    try {
      const result = await postData(`/add-new-accommodation`, accommodation);
      if (
        (result.data.status && result.data.status !== "OK") ||
        result.status !== 200
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

      dispatch(addAccommodation(result.data));

      dispatch(
        setAlert({
          type: AlertTypeEnum.success,
          status: true,
          message: `Unit (${accommodation.accommodationNumber}) has been saved successfully.`,
        })
      );

      const socketMessage: SocketMessageModel = {
        userId: Number(currentUser.userId),
        userRole: String(currentUser.userRole),
        content: JSON.stringify(result.data),
        activity: UserActivity.addAccommodation,
      };

      webSocketService.sendMessage("/app/add-accommodation", socketMessage);

      setShowForm(false);
      handleClearForm();
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("SAVE NEW ACCOMMODATION CANCELLED: ", error.message);
      }
    }
  }, [accommodation, dispatch, handleClearForm, setShowForm]);

  // handle update accommodation data basing on accommodation ID
  const handleUpdateAccommodationData = async () => {
    try {
      const results = await putData(
        `/update-accommodation/${accommodationId}`,
        accommodation
      );

      if (
        (results.data.status && results.data.status !== "OK") ||
        results.status !== 200
      ) {
        // show error message in an alert on updating accommodation
        dispatch(
          setAlert({
            status: true,
            type: AlertTypeEnum.danger,
            message: results.data.message,
          })
        );

        return;
      }

      // update the accommodation data in the globel store upon successful update
      dispatch(
        updateAccommodation({
          id: Number(accommodationId),
          changes: results.data,
        })
      );

      // show alert message upon successful accommodation update
      dispatch(
        setAlert({
          status: true,
          type: AlertTypeEnum.success,
          message: `Unit (${accommodation.accommodationNumber}) has been updated successfully.`,
        })
      );

      // send socket message
      const socketMessage: SocketMessageModel = {
        userId: Number(currentUser.userId),
        userRole: String(currentUser.userRole),
        content: JSON.stringify(results.data),
        activity: UserActivity.updateAccommodation,
      };

      webSocketService.sendMessage("/app/update-accommodation", socketMessage);

      // close the confirm message after confirming update of the accommodation
      dispatch(setConfirm({ message: "", status: false }));

      // hide accommodation form and navidate back to the accommmodation details
      setShowForm(false);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("UPDATE ACCOMMODATION DATA CANCELLED: ", error.message);
      }
    } finally {
      dispatch(setConfirm({ message: "", status: false }));
    }
  };

  // set the select accommodation for editing depending on accommodation ID
  useEffect(() => {
    setAccommodation(
      currentAccommodation ? currentAccommodation : INITIAL_ACCOMMODATION_DATA
    );
  }, [accommodationId, currentAccommodation]);

  return (
    <form
      className="w-full h-[calc(100vh-90px)] overflow-auto"
      onSubmit={(e: React.FormEvent) => e.preventDefault()}
    >
      <div className="w-full lg:w-5/6 h-fit bg-gray-100 m-auto shadow-lg p-5">
        <div className="w-full px-3 flex justify-between items-center sticky top-0 py-2 bg-white shadow-lg">
          {!accommodationId && (
            <h1 className="w-3/4 text-center text-2xl tracking-wider">
              Add {selectedType?.label}
            </h1>
          )}

          {accommodationId && (
            <h1 className="w-3/4 text-center text-2xl tracking-wider">
              Update{" "}
              {ACCOMMODATION_TYPE_DATA.find(
                (type) => type.value === selectedType?.values
              )?.label +
                " (" +
                accommodation.accommodationNumber +
                ")"}
            </h1>
          )}
          <h1
            className="text-xl p-1 bg-gray-100 lg:hover:bg-red-600 cursor-pointer lg:hover:text-white font-bold"
            onClick={() => setShowForm(false)}
          >
            <RxCross1 />
          </h1>
        </div>
        <div className="body py-5 text-sm flex flex-wrap items-center justify-start capitalize">
          {/* ACCOMMODATION TYPE */}
          {accommodationId && (
            <div className="form-group p-2 py-5 w-full lg:w-1/3">
              <label
                htmlFor="accommodationType"
                className="w-full font-bold px-3"
              >
                Unit type<span className="text-red">*</span>
              </label>
              <select
                id="accommodationType"
                className="w-full outline-none border border-gray-400 focus:border-2 focus:border-blue-400 rounded-lg"
                onChange={(e) => {
                  handelChangeSelectField(e);
                  markRequiredFormField(e.target);
                  setSelectedType({
                    label: String(
                      ACCOMMODATION_TYPE_DATA.find(
                        (type) => type.value === e.target.value
                      )?.label
                    ),
                    values: e.target.value,
                  });
                }}
              >
                <option value={String(selectedType?.values)}>
                  {
                    ACCOMMODATION_TYPE_DATA.find(
                      (type) => type.value === selectedType?.values
                    )?.label
                  }
                </option>

                {ACCOMMODATION_TYPE_DATA.map((type) => (
                  <option value={type.value}>{type.label}</option>
                ))}
              </select>
              <small className="w-full"></small>
            </div>
          )}

          {/* UNIT NUMBER */}
          <div className="form-group p-2 py-5 w-full lg:w-1/3">
            <label
              htmlFor="accommodationNumber"
              className="w-full font-bold px-3"
            >
              Unit number <span className="text-red">*</span>
            </label>
            <input
              ref={focusOnSave}
              type="text"
              id="accommodationNumber"
              value={accommodation.accommodationNumber || ""}
              placeholder="Enter unit number"
              className="w-full outline-none border border-gray-400 focus:border-2 focus:border-blue-400 rounded-lg"
              onChange={(e) => {
                markRequiredFormField(e.target);
                handelChangeTextField(e);
              }}
            />
            <small className="w-full text-red-600">
              Unit number is required!
            </small>
          </div>

          {/* FLOOR */}
          {facility.facilityCategory !== facilityCategory.manssion &&
            facility.facilityCategory !== facilityCategory.villa && (
              <div className="form-group p-2 py-5 w-full lg:w-1/3">
                <label htmlFor="floor" className="w-full font-bold px-3">
                  floor
                  <span className="text-red-600"></span>
                </label>
                <input
                  type="text"
                  id="floor"
                  value={accommodation.floor || ""}
                  placeholder="Enter floor"
                  className="w-full outline-none border border-gray-400 focus:border-2 focus:border-blue-400 rounded-lg"
                  onChange={handelChangeTextField}
                />
                <small className="w-full"></small>
              </div>
            )}

          {/* PRICE */}
          <div className="form-group p-2 py-5 w-full lg:w-1/3">
            <label htmlFor="price" className="w-full font-bold px-3">
              price ({facility.preferedCurrency})
              <span className="text-red">*</span>
            </label>
            <input
              type="number"
              id="price"
              value={accommodation.price || ""}
              placeholder="$. 0"
              className="w-full outline-none border border-gray-400 focus:border-2 focus:border-blue-400 rounded-lg"
              onChange={(e) => {
                markRequiredFormField(e.target);
                handelChangeTextField(e);
              }}
            />
            <small className="w-full text-red-600">Price is required!</small>
          </div>

          {/*NUMBER OF BEDROOMS */}
          {(selectedType?.values === facilityCategory.manssion ||
            selectedType?.values === facilityCategory.villa ||
            selectedType?.values === AccommodationType.apartment) && (
            <div className="form-group p-2 py-5 w-full lg:w-1/3">
              <label htmlFor="bedrooms" className="w-full font-bold px-3">
                number of bedrooms {accommodation.bedrooms}{" "}
                <span className="text-red">*</span>
              </label>
              <input
                type="number"
                id="bedrooms"
                value={accommodation.bedrooms || ""}
                placeholder="0"
                className="w-full outline-none border border-gray-400 focus:border-2 focus:border-blue-400 rounded-lg"
                onChange={(e) => {
                  markRequiredFormField(e.target);
                  handelChangeTextField(e);
                }}
              />
              <small className="w-full text-red-600">
                Number of bedrooms is required!
              </small>
            </div>
          )}

          {/* FULLY FUNISHED */}
          {(selectedType?.values === AccommodationType.apartment ||
            selectedType?.values === AccommodationType.hostelRoom ||
            selectedType?.values === AccommodationType.manssion ||
            selectedType?.values === AccommodationType.villa ||
            selectedType?.values === AccommodationType.rental) && (
            <div className="form-group flex items-center p-2 py-5 w-full lg:w-1/3 px-5">
              <input
                type="checkbox"
                id="fullyFurnished"
                checked={accommodation.fullyFurnished}
                className="outline-none border border-gray-400 focus:border-2 focus:border-blue-400 rounded-lg h-8 w-8 mx-1"
                onChange={() =>
                  setAccommodation((prev) => ({
                    ...prev,
                    fullyFurnished: !accommodation.fullyFurnished,
                  }))
                }
              />
              <label htmlFor="fullyFurnished" className="w-full font-bold">
                fully funished
              </label>
              <small className="w-fit"></small>
            </div>
          )}

          {/* selfContained */}
          {(selectedType?.values === AccommodationType.hostelRoom ||
            selectedType?.values === AccommodationType.rental ||
            selectedType?.values === AccommodationType.oficeSpace) && (
            <div className="form-group flex items-center p-2 py-5 w-full lg:w-1/3 px-5">
              <input
                type="checkbox"
                id="selfContained"
                checked={accommodation.selfContained}
                className="outline-none border border-gray-400 focus:border-2 focus:border-blue-400 rounded-lg h-8 w-8 mx-1"
                onChange={() =>
                  setAccommodation((prev) => ({
                    ...prev,
                    selfContained: !accommodation.selfContained,
                  }))
                }
              />
              <label htmlFor="selfContained" className="w-full font-bold">
                self contained
              </label>
              <small className="w-fit"></small>
            </div>
          )}

          {/* accommodation category */}
          {(selectedType?.values === AccommodationType.hostelRoom ||
            selectedType?.values === AccommodationType.lodgeRoom ||
            selectedType?.values === AccommodationType.hotelRoom ||
            selectedType?.values === AccommodationType.motelRoom) && (
            <div className="form-group p-2 py-5 w-full lg:w-1/3">
              <label
                htmlFor="accommodationCategory"
                className="w-full font-bold px-3"
              >
                Unit category <span className="text-red">*</span>
              </label>
              <select
                id="accommodationCategory"
                className="w-full outline-none border border-gray-400 focus:border-2 focus:border-blue-400 rounded-lg"
                onChange={handelChangeSelectField}
              >
                <option value={accommodation.accommodationCategory || ""}>
                  {accommodation.accommodationCategory
                    ? ACCOMMODATION_CATEGORY.find(
                        (category) =>
                          category.value === accommodation.accommodationCategory
                      )?.label
                    : "SELECT CATEGORY"}
                </option>
                {ACCOMMODATION_CATEGORY.map((category, index) => (
                  <option key={index} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              <small className="w-full"></small>
            </div>
          )}

          {/* gender restriction */}
          {selectedType?.values === AccommodationType.hostelRoom && (
            <div className="form-group p-2 py-5 w-full lg:w-1/3">
              <label
                htmlFor="genderRestriction"
                className="w-full font-bold px-3"
              >
                gender restriction
              </label>
              <select
                id="genderRestriction"
                className="w-full outline-none border border-gray-400 focus:border-2 focus:border-blue-400 rounded-lg"
                onChange={handelChangeSelectField}
              >
                <option value={accommodation.genderRestriction || ""}>
                  {accommodation.genderRestriction
                    ? accommodation.genderRestriction
                    : "SELECT GENDER"}
                </option>
                {GENDER_RESTRICTION_DATA.map((gender, index) => (
                  <option key={index} value={gender.value}>
                    {gender.label}
                  </option>
                ))}
              </select>
              <small className="w-full"></small>
            </div>
          )}

          {/* capacity */}
          {(selectedType?.values === AccommodationType.hostelRoom ||
            selectedType?.values === AccommodationType.lodgeRoom ||
            selectedType?.values === AccommodationType.hotelRoom ||
            selectedType?.values === AccommodationType.eventsSpace ||
            selectedType?.values === AccommodationType.meetingSpace ||
            selectedType?.values === AccommodationType.conferenceSpace ||
            selectedType?.values === AccommodationType.motelRoom) && (
            <div className="form-group p-2 py-5 w-full lg:w-1/3">
              <label htmlFor="capacity" className="w-full font-bold px-3">
                capacity <span className="text-red">*</span>
              </label>
              <input
                type="number"
                id="capacity"
                value={accommodation.capacity || ""}
                placeholder="0"
                className="w-full outline-none border border-gray-400 focus:border-2 focus:border-blue-400 rounded-lg"
                onChange={handelChangeTextField}
              />
              <small className="w-full"></small>
            </div>
          )}

          {/* payment partern*/}
          <div className="form-group p-2 py-5 w-full lg:w-1/3">
            <label htmlFor="paymentPartten" className="w-full font-bold px-3">
              payment parttern
              <span className="text-red">*</span>
            </label>
            <select
              id="paymentPartten"
              className="w-full outline-none border border-gray-400 focus:border-2 focus:border-blue-400 rounded-lg"
              onChange={handelChangeSelectField}
            >
              <option value={accommodation.paymentPartten || ""}>
                {accommodation.paymentPartten
                  ? PAYMENT_PARTERN.find(
                      (partern) =>
                        partern.value === accommodation.paymentPartten
                    )?.label
                  : "SELECT PARTERN"}
              </option>
              {PAYMENT_PARTERN.map((partern, index) => (
                <option key={index} value={partern.value}>
                  {partern.label}
                </option>
              ))}
            </select>
            <small className="w-full"></small>
          </div>

          {/* room location*/}
          {(selectedType?.values === AccommodationType.shopRoom ||
            selectedType?.values === AccommodationType.marketStall ||
            selectedType?.values === AccommodationType.oficeSpace ||
            selectedType?.values === AccommodationType.restaurantSpace) && (
            <div className="form-group p-2 py-5 w-full lg:w-1/3">
              <label htmlFor="roomLocation" className="w-full font-bold px-3">
                unit location <span className="text-red">*</span>
              </label>
              <select
                id="roomLocation"
                className="w-full outline-none border border-gray-400 focus:border-2 focus:border-blue-400 rounded-lg"
                onChange={handelChangeSelectField}
              >
                <option value={accommodation.roomLocation || ""}>
                  {accommodation.roomLocation
                    ? accommodation.roomLocation
                    : "SELECT PARTERN"}
                </option>
                {ROOM_LOCATION_DATA.map((locaction, index) => (
                  <option key={index} value={locaction.value}>
                    {locaction.label}
                  </option>
                ))}
              </select>
              <small className="w-full"></small>
            </div>
          )}

          {/*number Of wash Rooms*/}
          {(selectedType?.values === AccommodationType.apartment ||
            selectedType?.values === AccommodationType.villa ||
            selectedType?.values === AccommodationType.manssion) && (
            <div className="form-group p-2 py-5 w-full lg:w-1/3">
              <label
                htmlFor="numberOfwashRooms"
                className="w-full font-bold px-3"
              >
                number of washrooms
              </label>
              <input
                type="number"
                id="numberOfwashRooms"
                value={accommodation.numberOfwashRooms || ""}
                placeholder="0"
                className="w-full outline-none border border-gray-400 focus:border-2 focus:border-blue-400 rounded-lg"
                onChange={handelChangeTextField}
              />
              <small className="w-full"></small>
            </div>
          )}

          {/* more description */}
          <div className="w-full px-2 py-4">
            <label htmlFor="description" className=" font-bold px-3 text-sm">
              More description
            </label>
            <textarea
              name="description"
              id="description"
              rows={10}
              maxLength={10000}
              value={accommodation.description || ""}
              placeholder="Add more description"
              className="outline-none border border-gray-400 w-full p-3 rounded-lg resize-none focus:border-blue-500"
              onChange={handelChangeTextArea}
            ></textarea>
          </div>

          {/* save new accommodation button */}
          {!accommodationId && (
            <div className="w-full py-10 flex justify-center text-lg ">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-300 text-white py-3 px-10 hover:bg-blue-300 rounded-lg"
                onClick={saveNewAccommodation}
              >
                Save
              </button>
            </div>
          )}

          {/* update accommodation button */}
          {accommodationId && (
            <div className="w-full py-10 flex justify-center text-lg ">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-300 text-white py-3 px-10 hover:bg-blue-300 rounded-lg"
                onClick={() => {
                  dispatch(
                    setConfirm({
                      message: `Are you sure you want to update unit (${selectedType?.values} ${accommodation.accommodationNumber})`,
                      status: true,
                    })
                  );

                  dispatch(
                    setUserAction({
                      userAction: () => handleUpdateAccommodationData(),
                    })
                  );
                }}
              >
                Update
              </button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default AccommodationForm;
