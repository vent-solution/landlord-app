import React from "react";
import { useSelector } from "react-redux";
import { getFacilities } from "../facilities/FacilitiesSlice";
import { businessTypeEnum } from "../../global/enums/businessTypeEnum";

interface Props {}

let NumberOfFacilities: React.FC<Props> = () => {
  const facilitiesState = useSelector(getFacilities);

  const { facilities, totalElements } = facilitiesState;

  const rentFacilities = facilities.filter(
    (facility) => facility.businessType === businessTypeEnum.rent
  );

  const rentWholeFacilities = facilities.filter(
    (facility) => facility.businessType === businessTypeEnum.rentWhole
  );

  const saleFacilities = facilities.filter(
    (facility) => facility.businessType === businessTypeEnum.sale
  );

  const saleCondominiumsFacilities = facilities.filter(
    (facility) => facility.businessType === businessTypeEnum.saleCondominium
  );

  const hospitalityFacilities = facilities.filter(
    (facility) => facility.businessType === businessTypeEnum.hospitality
  );

  // const otherFacilities = facilities.filter(
  //   (facility) => facility.businessType === businessTypeEnum.others
  // );

  return (
    <div className="w-full flex flex-wrap justify-between items-center text-center  uppercase my-10">
      <div className="mt-2 w-1/2 lg:w-1/6 px-2">
        <div className="border border-gray-400 py-5 shadow-lg bg-gradient-to-t from-blue-100 via-blue-200 to-blue-300">
          <h4 className="text-sm font-light text-gray-600">All Facilities</h4>
          <h1 className="text-3xl text-black font-light">{totalElements}</h1>
        </div>
      </div>

      <div className="mt-2 w-1/2 lg:w-1/6 px-2">
        <div className="border border-gray-400  py-5 shadow-lg bg-gradient-to-t from-orange-100 via-orange-200 to-orange-300">
          <h4 className="text-sm font-light text-gray-600">Rent units</h4>
          <h1 className="text-3xl text-black font-light">
            {rentFacilities.length}
          </h1>
        </div>
      </div>

      <div className="mt-2 w-1/2 lg:w-1/6 px-2 ">
        <div className="border border-gray-400 py-5 shadow-lg bg-gradient-to-t from-orange-100 via-orange-200 to-orange-300">
          <h4 className="text-sm font-light text-gray-600">
            Rent whole facility
          </h4>
          <h1 className="text-3xl text-black font-light">
            {rentWholeFacilities.length}
          </h1>
        </div>
      </div>

      <div className="mt-2 w-1/2 lg:w-1/6 px-2 ">
        <div className="border border-gray-400 py-5 shadow-lg bg-gradient-to-t from-green-100 via-green-200 to-green-300">
          <h4 className="text-sm font-light text-gray-600">
            Sale whole facility
          </h4>
          <h1 className="text-3xl text-black font-light">
            {saleFacilities.length}
          </h1>
        </div>
      </div>

      <div className="mt-2 w-1/2 lg:w-1/6 px-2 ">
        <div className="border border-gray-400 py-5 shadow-lg bg-gradient-to-t from-green-100 via-green-200 to-green-300">
          <h4 className="text-sm font-light text-gray-600">
            Sale condominiums
          </h4>
          <h1 className="text-3xl text-black font-light">
            {saleCondominiumsFacilities.length}
          </h1>
        </div>
      </div>

      <div className="mt-2 w-1/2 lg:w-1/6 px-2">
        <div className="border border-gray-400 py-5 shadow-lg bg-gradient-to-t from-red-100 via-red-200 to-red-300">
          <h4 className="text-sm font-light text-gray-600">Hospitality</h4>
          <h1 className="text-3xl text-black font-light">
            {hospitalityFacilities.length}
          </h1>
        </div>
      </div>
    </div>
  );
};

NumberOfFacilities = React.memo(NumberOfFacilities);

export default NumberOfFacilities;
