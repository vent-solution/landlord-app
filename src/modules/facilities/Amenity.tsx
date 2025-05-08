import React from "react";
import { GiCheckMark } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import { AmenityEnum } from "../../global/enums/amenityEnum";

interface Props {
  name?: string;
  availability?: boolean;
  amenity?: string | boolean;
}
const Amenity: React.FC<Props> = ({ name, availability, amenity }) => {
  return (
    <>
      {availability && (
        <p className="flex justify-between text-center text-sm bg-black px-5 border-b-2 border-gray-300 hover:bg-gray-700 py-3">
          <b className="w-fit capitalize text-cyan-400 font-extralight">
            {name}
          </b>
          <span className="w-1/2 flex justify-between">
            <span className="flex justify-center items-center w-1/3 font-bold text-lg">
              {amenity === AmenityEnum.no ? (
                <RxCross2 className="text-red-600" />
              ) : !amenity ? (
                <RxCross2 className="text-red-600" />
              ) : (
                <GiCheckMark className="text-green-600" />
              )}
            </span>
            <span className="flex justify-center items-center w-1/3 font-bold text-lg">
              {amenity === AmenityEnum.paid ? (
                <RxCross2 className="text-red-600" />
              ) : amenity === true ? (
                <GiCheckMark className="text-green-600" />
              ) : (
                <GiCheckMark className="text-green-600" />
              )}
            </span>
            <span className="flex justify-center items-center w-1/3 font-bold text-lg">
              {amenity === AmenityEnum.free ? (
                <RxCross2 className="text-red-600" />
              ) : amenity === true ? (
                <RxCross2 className="text-red-600" />
              ) : (
                <GiCheckMark className="text-green-600" />
              )}
            </span>
          </span>
        </p>
      )}
    </>
  );
};

export default Amenity;
