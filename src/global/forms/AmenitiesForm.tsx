import React, { useEffect, useState } from "react";
import { AmenitiesModel } from "../../modules/facilities/AmenitiesModel";
import { AmenityEnum } from "../enums/amenityEnum";
import { CreationFacilitiesModel } from "../../modules/facilities/FacilityModel";
import { facilityCategory } from "../enums/facilityCategory";
import { businessTypeEnum } from "../enums/businessTypeEnum";
import { useParams } from "react-router-dom";
import markRequiredFormField from "../validation/markRequiredFormField";

interface Props {
  setAmenities: React.Dispatch<React.SetStateAction<AmenitiesModel>>;
  amenities: AmenitiesModel;

  facilityData: CreationFacilitiesModel;
}

let AmenitiesForm: React.FC<Props> = ({
  setAmenities,
  amenities,
  facilityData,
}) => {
  const [amenityOptions] = useState<{ label: string; value: string }[]>([
    { label: "No", value: AmenityEnum.no },
    { label: "Free", value: AmenityEnum.free },
    { label: "Paid", value: AmenityEnum.paid },
  ]);

  const { facilityId } = useParams();

  // set amenities facility id
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setAmenities((prev) => ({
        ...prev,
        facility: { facilityId: Number(facilityId) },
      }));
    }, 1000);

    return () => clearTimeout(timeOut);
  }, [facilityId, setAmenities]);

  return (
    <>
      {/* parking */}
      <div className="form-group w-full lg:w-1/4 px-4 py-0 lg:mx-0 my-5">
        <label htmlFor="parking" className="font-bold">
          Parking
          <span className="tex-red-500"></span>
        </label>

        <select
          name=""
          id="parking"
          className="w-full  outline-none border"
          onChange={(e) => {
            markRequiredFormField(e.target);
            setAmenities({ ...amenities, parking: e.target.value });
          }}
        >
          <option
            value={
              facilityData.facilityAmenities?.parking
                ? facilityData.facilityAmenities?.parking
                : AmenityEnum.no
            }
            className="uppercase"
          >
            {facilityData.facilityAmenities?.parking
              ? amenityOptions.find(
                  (option) =>
                    option.value === facilityData.facilityAmenities?.parking
                )?.label
              : "SELECT VALUE"}
          </option>
          {amenityOptions.map((amenity, index) => (
            <option key={index} value={amenity.value} className="capitalize">
              {amenity.label}
            </option>
          ))}
        </select>
      </div>

      {/* water */}
      {(facilityData.businessType === businessTypeEnum.rent ||
        facilityData.businessType === businessTypeEnum.saleCondominium) && (
        <div className="form-group w-full lg:w-1/4 px-4 py-0 lg:mx-0 my-5">
          <label htmlFor="water" className="font-bold">
            Water
            <span className="tex-red-500"></span>
          </label>

          <select
            name=""
            id="water"
            className="w-full  outline-none border"
            onChange={(e) => {
              markRequiredFormField(e.target);
              setAmenities({ ...amenities, water: e.target.value });
            }}
          >
            <option
              value={
                facilityData.facilityAmenities?.water
                  ? facilityData.facilityAmenities?.water
                  : AmenityEnum.no
              }
              className="uppercase"
            >
              {facilityData.facilityAmenities?.water
                ? amenityOptions.find(
                    (option) =>
                      option.value === facilityData.facilityAmenities?.water
                  )?.label
                : "SELECT VALUE"}
            </option>
            {amenityOptions.map((amenity, index) => (
              <option key={index} value={amenity.value} className="capitalize">
                {amenity.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* electricity */}
      {(facilityData.businessType === businessTypeEnum.rent ||
        facilityData.businessType === businessTypeEnum.saleCondominium) && (
        <div className="form-group w-full lg:w-1/4 px-4 py-0 lg:mx-0 my-5">
          <label htmlFor="electricity" className="font-bold">
            Electricity
            <span className="tex-red-500"></span>
          </label>

          <select
            name=""
            id="electricity"
            className="w-full  outline-none border"
            onChange={(e) => {
              markRequiredFormField(e.target);
              setAmenities({ ...amenities, electricity: e.target.value });
            }}
          >
            <option
              value={
                facilityData.facilityAmenities?.electricity
                  ? facilityData.facilityAmenities?.electricity
                  : AmenityEnum.no
              }
              className="uppercase"
            >
              {facilityData.facilityAmenities?.electricity
                ? amenityOptions.find(
                    (option) =>
                      option.value ===
                      facilityData.facilityAmenities?.electricity
                  )?.label
                : "SELECT VALUE"}
            </option>
            {amenityOptions.map((amenity, index) => (
              <option key={index} value={amenity.value} className="capitalize">
                {amenity.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* wifi */}
      <div className="form-group w-full lg:w-1/4 px-4 py-0 lg:mx-0 my-5">
        <label htmlFor="wifi" className="font-bold">
          Wifi
          <span className="tex-red-500"></span>
        </label>

        <select
          name=""
          id="wifi"
          className="w-full  outline-none border"
          onChange={(e) => {
            markRequiredFormField(e.target);
            setAmenities({ ...amenities, wifi: e.target.value });
          }}
        >
          <option
            value={
              facilityData.facilityAmenities?.wifi
                ? facilityData.facilityAmenities?.wifi
                : AmenityEnum.no
            }
            className="uppercase"
          >
            {facilityData.facilityAmenities?.wifi
              ? amenityOptions.find(
                  (option) =>
                    option.value === facilityData.facilityAmenities?.wifi
                )?.label
              : "SELECT VALUE"}
          </option>
          {amenityOptions.map((amenity, index) => (
            <option key={index} value={amenity.value} className="capitalize">
              {amenity.label}
            </option>
          ))}
        </select>
      </div>

      {/* statndby generator */}
      {(facilityData.businessType === businessTypeEnum.rent ||
        facilityData.businessType === businessTypeEnum.saleCondominium) && (
        <div className="form-group w-full lg:w-1/4 px-4 py-0 lg:mx-0 flex items-center my-5">
          <input
            type="checkbox"
            checked={amenities.standByGenerator}
            name="standByGenerator"
            id="standByGenerator"
            className="outline-none border border-gray-400 focus:border-2 focus:border-blue-400 rounded-lg h-6 w-6 mx-1"
            onChange={(e) => {
              markRequiredFormField(e.target);
              setAmenities({
                ...amenities,
                standByGenerator: !amenities.standByGenerator,
              });
            }}
          />
          <label htmlFor="cabelInternet" className="font-bold px-2">
            Statndby generator
            <span className="tex-red-500"></span>
          </label>
        </div>
      )}

      {/* elevator */}
      <div className="form-group w-full lg:w-1/4 px-4 py-0 lg:mx-0 flex items-center my-5">
        <input
          type="checkbox"
          name="elevator"
          checked={amenities.elevator}
          id="elevator"
          className="w-6 h-6  checked:bg-blue-500 checked:border-transparent border border-gray-300 rounded-md"
          onChange={(e) =>
            setAmenities({
              ...amenities,
              elevator: !amenities.elevator,
            })
          }
        />
        <label htmlFor="cabelInternet" className="font-bold px-2">
          Elevator
          <span className="tex-red-500"></span>
        </label>
      </div>

      {/* surveillance cameras */}
      {(facilityData.businessType === businessTypeEnum.rent ||
        facilityData.businessType === businessTypeEnum.saleCondominium) && (
        <div className="form-group w-full lg:w-1/4 px-4 py-0 lg:mx-0 flex items-center my-5">
          <input
            type="checkbox"
            name="surveillanceCameras"
            checked={amenities.surveillanceCameras}
            id="surveillanceCameras"
            className="w-6 h-6  checked:bg-blue-500 checked:border-transparent border border-gray-300 rounded-md"
            onChange={(e) =>
              setAmenities({
                ...amenities,
                surveillanceCameras: !amenities.surveillanceCameras,
              })
            }
          />
          <label htmlFor="cabelInternet" className="font-bold px-2">
            Surveillance Cameras
            <span className="tex-red-500"></span>
          </label>
        </div>
      )}

      {/* security guard */}
      {(facilityData.businessType === businessTypeEnum.rent ||
        facilityData.businessType === businessTypeEnum.saleCondominium) && (
        <div className="form-group w-full lg:w-1/4 px-4 py-0 lg:mx-0 flex items-center my-5">
          <input
            type="checkbox"
            name="securityGuard"
            checked={amenities.securityGuard}
            id="securityGuard"
            className="w-6 h-6  checked:bg-blue-500 checked:border-transparent border border-gray-300 rounded-md"
            onChange={(e) =>
              setAmenities({
                ...amenities,
                securityGuard: !amenities.securityGuard,
              })
            }
          />
          <label htmlFor="cabelInternet" className="font-bold px-2">
            Security Guard
            <span className="tex-red-500"></span>
          </label>
        </div>
      )}

      {/* cabel internet */}
      <div className="form-group w-full lg:w-1/4 px-4 py-0 lg:mx-0 my-5">
        <label htmlFor="cabelInternet" className="font-bold">
          Cabel internet
          <span className="tex-red-500"></span>
        </label>

        <select
          name=""
          id="cabelInternet"
          className="w-full  outline-none border"
          onChange={(e) =>
            setAmenities({ ...amenities, cabelInternet: e.target.value })
          }
        >
          <option
            value={
              amenities.cabelInternet ? amenities.cabelInternet : AmenityEnum.no
            }
            className="uppercase"
          >
            {amenities.cabelInternet
              ? amenityOptions.find(
                  (option) => option.value === amenities.cabelInternet
                )?.label
              : "SELECT VALUE"}
          </option>
          {amenityOptions.map((amenity, index) => (
            <option key={index} value={amenity.value} className="capitalize">
              {amenity.label}
            </option>
          ))}
        </select>
      </div>

      {/* wash rooms */}
      {(facilityData.businessType === businessTypeEnum.rent ||
        facilityData.businessType === businessTypeEnum.saleCondominium) &&
        (facilityData.facilityCategory === facilityCategory.arcade ||
          facilityData.facilityCategory === facilityCategory.mall) && (
          <div className="form-group w-full lg:w-1/4 px-4 py-0 lg:mx-0 my-5">
            <label htmlFor="washRoom" className="font-bold">
              Wash rooms
              <span className="tex-red-500"></span>
            </label>
            <select
              name=""
              id="washRoom"
              className="w-full  outline-none border"
              onChange={(e) =>
                setAmenities({ ...amenities, washRoom: e.target.value })
              }
            >
              <option
                value={amenities.washRoom ? amenities.washRoom : AmenityEnum.no}
                className="uppercase"
              >
                {amenities.washRoom
                  ? amenityOptions.find(
                      (option) => option.value === amenities.washRoom
                    )?.label
                  : " SELECT VALUE"}
              </option>
              {amenityOptions.map((amenity, index) => (
                <option
                  key={index}
                  value={amenity.value}
                  className="capitalize"
                >
                  {amenity.label}
                </option>
              ))}
            </select>
          </div>
        )}

      {/* airpot transport */}
      {(facilityData.facilityCategory === facilityCategory.guestHouse ||
        facilityData.facilityCategory === facilityCategory.motel ||
        facilityData.facilityCategory === facilityCategory.hotel ||
        facilityData.facilityCategory === facilityCategory.lodge ||
        facilityData.facilityCategory === facilityCategory.hostel ||
        facilityData.facilityCategory ===
          facilityCategory.apartmentBuilding) && (
        <div className="form-group w-full lg:w-1/4 px-4 py-0 lg:mx-0 my-5">
          <label htmlFor="airportTransport" className="font-bold">
            Airport transport
            <span className="tex-red-500"></span>
          </label>
          <select
            name=""
            id="airportTransport"
            className="w-full  outline-none border"
            onChange={(e) =>
              setAmenities({ ...amenities, airportTransport: e.target.value })
            }
          >
            <option
              value={
                amenities.airportTransport
                  ? amenities.airportTransport
                  : AmenityEnum.no
              }
              className="uppercase"
            >
              {amenities.airportTransport
                ? amenityOptions.find(
                    (option) => option.value === amenities.airportTransport
                  )?.label
                : "SELECT VALUE"}
            </option>
            {amenityOptions.map((amenity, index) => (
              <option key={index} value={amenity.value} className="capitalize">
                {amenity.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* gym */}
      {(facilityData.facilityCategory === facilityCategory.guestHouse ||
        facilityData.facilityCategory === facilityCategory.motel ||
        facilityData.facilityCategory === facilityCategory.hotel ||
        facilityData.facilityCategory === facilityCategory.lodge ||
        facilityData.facilityCategory === facilityCategory.hostel ||
        facilityData.facilityCategory ===
          facilityCategory.apartmentBuilding) && (
        <div className="form-group w-full lg:w-1/4 px-4 py-0 lg:mx-0 my-5">
          <label htmlFor="gym" className="font-bold">
            Gym
            <span className="tex-red-500"></span>
          </label>
          <select
            name=""
            id="gym"
            className="w-full  outline-none border"
            onChange={(e) =>
              setAmenities({ ...amenities, gym: e.target.value })
            }
          >
            <option
              value={amenities.gym ? amenities.gym : AmenityEnum.no}
              className="uppercase"
            >
              {amenities.gym
                ? amenityOptions.find(
                    (option) => option.value === amenities.gym
                  )?.label
                : "SELECT VALUE"}
            </option>
            {amenityOptions.map((amenity, index) => (
              <option key={index} value={amenity.value} className="capitalize">
                {amenity.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* breakFast */}
      {(facilityData.facilityCategory === facilityCategory.guestHouse ||
        facilityData.facilityCategory === facilityCategory.motel ||
        facilityData.facilityCategory === facilityCategory.hotel ||
        facilityData.facilityCategory === facilityCategory.lodge ||
        facilityData.facilityCategory ===
          facilityCategory.apartmentBuilding) && (
        <div className="form-group w-full lg:w-1/4 px-4 py-0 lg:mx-0 my-5">
          <label htmlFor="breakFast" className="font-bold">
            Breakfast
            <span className="tex-red-500"></span>
          </label>
          <select
            name=""
            id="breakFast"
            className="w-full  outline-none border"
            onChange={(e) =>
              setAmenities({ ...amenities, breakFast: e.target.value })
            }
          >
            <option
              value={amenities.breakFast ? amenities.breakFast : AmenityEnum.no}
              className="uppercase"
            >
              {amenities.breakFast
                ? amenityOptions.find(
                    (option) => option.value === amenities.breakFast
                  )?.label
                : "SELECT VALUE"}
            </option>
            {amenityOptions.map((amenity, index) => (
              <option key={index} value={amenity.value} className="capitalize">
                {amenity.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* swimming pool */}
      {(facilityData.facilityCategory === facilityCategory.hostel ||
        facilityData.facilityCategory === facilityCategory.guestHouse ||
        facilityData.facilityCategory === facilityCategory.motel ||
        facilityData.facilityCategory === facilityCategory.hotel ||
        facilityData.facilityCategory ===
          facilityCategory.apartmentBuilding) && (
        <div className="form-group w-full lg:w-1/4 px-4 py-0 lg:mx-0 my-5">
          <label htmlFor="swimmingPool" className="font-bold">
            Swimmingpool
            <span className="tex-red-500"></span>
          </label>
          <select
            name=""
            id="swimmingPool"
            className="w-full  outline-none border"
            onChange={(e) =>
              setAmenities({ ...amenities, swimmingPool: e.target.value })
            }
          >
            <option
              value={
                amenities.swimmingPool ? amenities.swimmingPool : AmenityEnum.no
              }
              className="uppercase"
            >
              {amenities.swimmingPool
                ? amenityOptions.find(
                    (option) => option.value === amenities.swimmingPool
                  )?.label
                : "SELECT VALUE"}
            </option>
            {amenityOptions.map((amenity, index) => (
              <option key={index} value={amenity.value} className="capitalize">
                {amenity.label}
              </option>
            ))}
          </select>
        </div>
      )}
      {/* hostel shuttle */}
      {facilityData.facilityCategory === facilityCategory.hostel && (
        <div className="form-group w-full lg:w-1/4 px-4 py-0 lg:mx-0 my-5">
          <label htmlFor="hostelShuttle" className="font-bold">
            Hostel shuttle
            <span className="tex-red-500"></span>
          </label>
          <select
            name=""
            id="hostelShuttle"
            className="w-full  outline-none border"
            onChange={(e) =>
              setAmenities({ ...amenities, hostelShuttle: e.target.value })
            }
          >
            <option
              value={
                amenities.hostelShuttle
                  ? amenities.hostelShuttle
                  : AmenityEnum.no
              }
              className="uppercase"
            >
              {amenities.hostelShuttle
                ? amenityOptions.find(
                    (option) => option.value === amenities.hostelShuttle
                  )?.label
                : "SELECT VALUE"}
            </option>
            {amenityOptions.map((amenity, index) => (
              <option key={index} value={amenity.value} className="capitalize">
                {amenity.label}
              </option>
            ))}
          </select>
        </div>
      )}
      {/* conference space */}
      {(facilityData.facilityCategory === facilityCategory.hostel ||
        facilityData.facilityCategory === facilityCategory.guestHouse ||
        facilityData.facilityCategory === facilityCategory.motel ||
        facilityData.facilityCategory === facilityCategory.hotel ||
        facilityData.facilityCategory ===
          facilityCategory.apartmentBuilding) && (
        <div className="form-group w-full lg:w-1/4 px-4 py-0 lg:mx-0 my-5">
          <label htmlFor="conferenceSpace" className="font-bold">
            Conference space
            <span className="tex-red-500"></span>
          </label>
          <select
            name=""
            id="conferenceSpace"
            className="w-full  outline-none border"
            onChange={(e) =>
              setAmenities({ ...amenities, conferenceSpace: e.target.value })
            }
          >
            <option
              value={
                amenities.conferenceSpace
                  ? amenities.conferenceSpace
                  : AmenityEnum.no
              }
              className="uppercase"
            >
              {amenities.conferenceSpace
                ? amenityOptions.find(
                    (option) => option.value === amenities.conferenceSpace
                  )?.label
                : "SELECT VALUE"}
            </option>
            {amenityOptions.map((amenity, index) => (
              <option key={index} value={amenity.value} className="capitalize">
                {amenity.label}
              </option>
            ))}
          </select>
        </div>
      )}
      {/* canteen */}
      {(facilityData.facilityCategory === facilityCategory.hostel ||
        facilityData.facilityCategory === facilityCategory.guestHouse ||
        facilityData.facilityCategory === facilityCategory.motel ||
        facilityData.facilityCategory === facilityCategory.hotel ||
        facilityData.facilityCategory === facilityCategory.lodge) && (
        <div className="form-group w-full lg:w-1/4 px-4 py-0 lg:mx-0 my-5">
          <label htmlFor="canteen" className="font-bold">
            Canteen
            <span className="tex-red-500"></span>
          </label>
          <select
            name=""
            id="canteen"
            className="w-full  outline-none border"
            onChange={(e) =>
              setAmenities({ ...amenities, canteen: e.target.value })
            }
          >
            <option
              value={amenities.canteen ? amenities.canteen : AmenityEnum.no}
              className="uppercase"
            >
              {amenities.canteen
                ? amenityOptions.find((option) => option.value)?.label
                : "SELECT VALUE"}
            </option>
            {amenityOptions.map((amenity, index) => (
              <option key={index} value={amenity.value} className="capitalize">
                {amenity.label}
              </option>
            ))}
          </select>
        </div>
      )}
      {/* clinic */}
      {(facilityData.facilityCategory === facilityCategory.hostel ||
        facilityData.facilityCategory === facilityCategory.guestHouse ||
        facilityData.facilityCategory === facilityCategory.motel ||
        facilityData.facilityCategory === facilityCategory.hotel) && (
        <div className="form-group w-full lg:w-1/4 px-4 py-0 lg:mx-0 my-5">
          <label htmlFor="clinic" className="font-bold">
            Clinic
            <span className="tex-red-500"></span>
          </label>
          <select
            name=""
            id="clinic"
            className="w-full  outline-none border"
            onChange={(e) =>
              setAmenities({ ...amenities, clinic: e.target.value })
            }
          >
            <option
              value={amenities.clinic ? amenities.clinic : AmenityEnum.no}
              className="uppercase"
            >
              {amenities.clinic
                ? amenityOptions.find(
                    (option) => option.value === amenities.clinic
                  )?.label
                : "SELECT VALUE"}
            </option>
            {amenityOptions.map((amenity, index) => (
              <option key={index} value={amenity.value} className="capitalize">
                {amenity.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* studyRoom */}
      {(facilityData.facilityCategory === facilityCategory.hostel ||
        facilityData.facilityCategory === facilityCategory.hotel ||
        facilityData.facilityCategory === facilityCategory.apartmentBuilding ||
        facilityData.facilityCategory === facilityCategory.rentalBuilding ||
        facilityData.facilityCategory === facilityCategory.guestHouse ||
        facilityData.facilityCategory === facilityCategory.motel) && (
        <div className="form-group w-full lg:w-1/4 px-4 py-0 lg:mx-0 my-5">
          <label htmlFor="studyRoom" className="font-bold">
            Study room
            <span className="tex-red-500"></span>
          </label>
          <select
            name=""
            id="studyRoom"
            className="w-full  outline-none border"
            onChange={(e) =>
              setAmenities({ ...amenities, studyRoom: e.target.value })
            }
          >
            <option
              value={amenities.studyRoom ? amenities.studyRoom : AmenityEnum.no}
              className="uppercase"
            >
              {amenities.studyRoom
                ? amenityOptions.find(
                    (option) => option.value === amenities.studyRoom
                  )?.label
                : "SELECT VALUE"}
            </option>
            {amenityOptions.map((amenity, index) => (
              <option key={index} value={amenity.value} className="capitalize">
                {amenity.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* communityRoom */}
      {(facilityData.facilityCategory === facilityCategory.hostel ||
        facilityData.facilityCategory === facilityCategory.rentalBuilding ||
        facilityData.facilityCategory ===
          facilityCategory.apartmentBuilding) && (
        <div className="form-group w-full lg:w-1/4 px-4 py-0 lg:mx-0 my-5">
          <label htmlFor="communityRoom" className="font-bold">
            Community room
            <span className="tex-red-500"></span>
          </label>
          <select
            name=""
            id="communityRoom"
            className="w-full  outline-none border"
            onChange={(e) =>
              setAmenities({ ...amenities, communityRoom: e.target.value })
            }
          >
            <option
              value={
                amenities.communityRoom
                  ? amenities.communityRoom
                  : AmenityEnum.no
              }
              className="uppercase"
            >
              {amenities.communityRoom
                ? amenityOptions.find(
                    (option) => option.value === amenities.communityRoom
                  )?.label
                : "SELECT VALUE"}
            </option>
            {amenityOptions.map((amenity, index) => (
              <option key={index} value={amenity.value} className="capitalize">
                {amenity.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* meetingSpace */}
      {(facilityData.facilityCategory === facilityCategory.hotel ||
        facilityData.facilityCategory === facilityCategory.apartmentBuilding ||
        facilityData.facilityCategory === facilityCategory.motel) && (
        <div className="form-group w-full lg:w-1/4 px-4 py-0 lg:mx-0 my-5">
          <label htmlFor="meetingSpace" className="font-bold">
            Meeting space
            <span className="tex-red-500"></span>
          </label>
          <select
            name=""
            id="meetingSpace"
            className="w-full  outline-none border"
            onChange={(e) =>
              setAmenities({ ...amenities, meetingSpace: e.target.value })
            }
          >
            <option
              value={
                amenities.meetingSpace ? amenities.meetingSpace : AmenityEnum.no
              }
              className="uppercase"
            >
              {amenities.meetingSpace
                ? amenityOptions.find(
                    (option) => option.value === amenities.meetingSpace
                  )?.label
                : "SELECT VALUE"}
            </option>
            {amenityOptions.map((amenity, index) => (
              <option key={index} value={amenity.value} className="capitalize">
                {amenity.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* eventsSpace */}
      {(facilityData.facilityCategory === facilityCategory.hotel ||
        facilityData.facilityCategory === facilityCategory.apartmentBuilding ||
        facilityData.facilityCategory === facilityCategory.motel) && (
        <div className="form-group w-full lg:w-1/4 px-4 py-0 lg:mx-0 my-5">
          <label htmlFor="eventsSpace" className="font-bold">
            Events space
            <span className="tex-red-500"></span>
          </label>
          <select
            name=""
            id="eventsSpace"
            className="w-full  outline-none border"
            onChange={(e) =>
              setAmenities({ ...amenities, eventsSpace: e.target.value })
            }
          >
            <option
              value={
                amenities.eventsSpace ? amenities.eventsSpace : AmenityEnum.no
              }
              className="uppercase"
            >
              {amenities.eventsSpace
                ? amenityOptions.find(
                    (option) => option.value === amenities.eventsSpace
                  )?.label
                : "SELECT VALUE"}
            </option>
            {amenityOptions.map((amenity, index) => (
              <option key={index} value={amenity.value} className="capitalize">
                {amenity.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* restaurant */}
      {(facilityData.facilityCategory === facilityCategory.hostel ||
        facilityData.facilityCategory === facilityCategory.hotel ||
        facilityData.facilityCategory === facilityCategory.motel ||
        facilityData.facilityCategory === facilityCategory.guestHouse ||
        facilityData.facilityCategory === facilityCategory.lodge) && (
        <div className="form-group w-full lg:w-1/4 px-4 py-0 lg:mx-0 my-5">
          <label htmlFor="restaurant" className="font-bold">
            Restaurant
            <span className="tex-red-500"></span>
          </label>
          <select
            name=""
            id="restaurant"
            className="w-full  outline-none border"
            onChange={(e) =>
              setAmenities({ ...amenities, restaurant: e.target.value })
            }
          >
            <option
              value={
                amenities.restaurant ? amenities.restaurant : AmenityEnum.no
              }
              className="uppercase"
            >
              {amenities.restaurant
                ? amenityOptions.find((option) => option)?.label
                : "SELECT VALUE"}
            </option>
            {amenityOptions.map((amenity, index) => (
              <option key={index} value={amenity.value} className="capitalize">
                {amenity.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* barAndLounge */}
      {(facilityData.facilityCategory === facilityCategory.hotel ||
        facilityData.facilityCategory === facilityCategory.motel ||
        facilityData.facilityCategory === facilityCategory.guestHouse ||
        facilityData.facilityCategory === facilityCategory.lodge) && (
        <div className="form-group w-full lg:w-1/4 px-4 py-0 lg:mx-0 my-5">
          <label htmlFor="barAndLounge" className="font-bold">
            Bar and lounge
            <span className="tex-red-500"></span>
          </label>
          <select
            name=""
            id="barAndLounge"
            className="w-full  outline-none border"
            onChange={(e) =>
              setAmenities({ ...amenities, barAndLounge: e.target.value })
            }
          >
            <option
              value={
                amenities.barAndLounge ? amenities.barAndLounge : AmenityEnum.no
              }
              className="uppercase"
            >
              {amenities.barAndLounge
                ? amenityOptions.find(
                    (option) => option.value === amenities.barAndLounge
                  )?.label
                : "SELECT VALUE"}
            </option>
            {amenityOptions.map((amenity, index) => (
              <option key={index} value={amenity.value} className="capitalize">
                {amenity.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* airConditioner */}
      <div className="form-group w-full lg:w-1/4 px-4 py-0 lg:mx-0 flex items-center my-5">
        <input
          type="checkbox"
          name="airConditioner"
          checked={amenities.airConditioner}
          id="airConditioner"
          className="w-6 h-6  checked:bg-blue-500 checked:border-transparent border border-gray-300 rounded-md"
          onChange={(e) =>
            setAmenities({
              ...amenities,
              airConditioner: !amenities.airConditioner,
            })
          }
        />
        <label htmlFor="cabelInternet" className="font-bold px-2">
          Air conditioner
          <span className="tex-red-500"></span>
        </label>
      </div>

      {/* fenced */}
      <div className="form-group w-full lg:w-1/4 px-4 py-0 lg:mx-0 flex items-center my-5">
        <input
          type="checkbox"
          name="fenced"
          checked={amenities.fenced}
          id="fenced"
          className="w-6 h-6  checked:bg-blue-500 checked:border-transparent border border-gray-300 rounded-md"
          onChange={(e) =>
            setAmenities({
              ...amenities,
              fenced: !amenities.fenced,
            })
          }
        />
        <label htmlFor="cabelInternet" className="font-bold px-2">
          Fenced
          <span className="tex-red-500"></span>
        </label>
      </div>
    </>
  );
};

AmenitiesForm = React.memo(AmenitiesForm);
export default AmenitiesForm;
