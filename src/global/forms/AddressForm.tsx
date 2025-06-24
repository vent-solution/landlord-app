import React from "react";
import { CreationFacilitiesModel } from "../../modules/facilities/FacilityModel";
import countriesList from "../../global/data/countriesList.json";
import markRequiredFormField from "../validation/markRequiredFormField";

interface Props {
  facilityData: CreationFacilitiesModel;

  setAddress: React.Dispatch<
    React.SetStateAction<{
      primaryAddress: string | null;
      country: string | null;
      city: string | null;
    }>
  >;
}

let AddressForm: React.FC<Props> = ({ facilityData, setAddress }) => {
  return (
    <>
      {/* primary address */}
      <div className="form-group w-full px-4 py-0 my-2 lg:mx-0">
        <label htmlFor="primaryAddress" className="font-bold">
          Primary Address
          <span className="tex-red-500">*</span>
        </label>
        <input
          type="text"
          id="primaryAddress"
          value={facilityData.facilityLocation.primaryAddress || ""}
          placeholder="Enter primary address"
          className="w-full outline-none border"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            markRequiredFormField(e.target);
            setAddress((prev) => ({
              ...prev,
              primaryAddress: String(e.target.value),
            }));
          }}
        />

        <small className="w-full text-red-600">
          Primary address is required
        </small>
      </div>

      {/* Country */}
      <div className="form-group w-full lg:w-1/2 px-4 py-0 my-2 lg:mx-0">
        <label htmlFor="facilityCategory" className="font-bold">
          Country <span className="tex-red-500">*</span>
        </label>

        <select
          name="country"
          id="country"
          className="w-full outline-none border"
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            markRequiredFormField(e.target);
            setAddress((prev) => ({
              ...prev,
              country: String(e.target.value),
            }));
          }}
        >
          <option value="">SELECT COUNTRY</option>
          {countriesList.map((country, index) => (
            <option key={index} value={country.value}>
              {country.label}
            </option>
          ))}
        </select>
        <small className="w-full text-red-600">Country is required!</small>
      </div>

      {/* state*/}
      {/* <div className="form-group w-full lg:w-1/3 px-4 py-0 my-2 lg:mx-0">
        <label htmlFor="state" className="font-bold">
          State
          <span className="tex-red-500"></span>
        </label>
        <input
          type="text"
          id="state"
          value={facilityData.facilityLocation.state || ""}
          placeholder="Enter state"
          className="w-full outline-none border"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAddress((prev) => ({
              ...prev,
              state: String(e.target.value),
            }))
          }
        />
      </div> */}

      {/* city*/}
      <div className="form-group w-full lg:w-1/2 px-4 py-0 my-2 lg:mx-0">
        <label htmlFor="city" className="font-bold">
          City/District/Municipality
          <span className="tex-red-500">*</span>
        </label>
        <input
          type="text"
          id="city"
          value={facilityData.facilityLocation.city || ""}
          placeholder="Enter City/District/Municipality"
          className="w-full outline-none border"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAddress((prev) => ({
              ...prev,
              city: String(e.target.value),
            }))
          }
        />

        <small className="w-full text-red-600">
          City/District/Municipality is required
        </small>
      </div>

      {/* county */}
      {/* <div className="form-group w-full lg:w-1/3 px-4 py-0 my-2 lg:mx-0">
        <label htmlFor="county" className="font-bold">
          County
          <span className="tex-red-500"></span>
        </label>
        <input
          type="text"
          id="county"
          value={facilityData.facilityLocation.county || ""}
          placeholder="Enter county"
          className="w-full outline-none border"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAddress((prev) => ({
              ...prev,
              county: String(e.target.value),
            }))
          }
        />
      </div> */}

      {/* division */}
      {/* <div className="form-group w-full lg:w-1/3 px-4 py-0 my-2 lg:mx-0">
        <label htmlFor="division" className="font-bold">
          Division/Subcounty/town council
          <span className="tex-red-500"></span>
        </label>
        <input
          type="text"
          id="division"
          value={facilityData.facilityLocation.division || ""}
          placeholder="Enter division"
          className="w-full outline-none border"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAddress((prev) => ({
              ...prev,
              division: String(e.target.value),
            }))
          }
        />
      </div> */}

      {/* parish */}
      {/* <div className="form-group w-full lg:w-1/3 px-4 py-0 my-2 lg:mx-0">
        <label htmlFor="parish" className="font-bold">
          Parish/Ward
          <span className="tex-red-500"></span>
        </label>
        <input
          type="text"
          id="parish"
          value={facilityData.facilityLocation.parish || ""}
          placeholder="Enter parish"
          className="w-full outline-none border"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAddress((prev) => ({
              ...prev,
              parish: String(e.target.value),
            }))
          }
        />
      </div> */}

      {/* zone */}
      {/* <div className="form-group w-full lg:w-1/3 px-4 py-0 my-2 lg:mx-0">
        <label htmlFor="zone" className="font-bold">
          Zone/village
          <span className="tex-red-500"></span>
        </label>
        <input
          type="text"
          id="zone"
          value={facilityData.facilityLocation.zone || ""}
          placeholder="Enter zone"
          className="w-full outline-none border"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAddress((prev) => ({
              ...prev,
              zone: String(e.target.value),
            }))
          }
        />
      </div> */}

      {/* street */}
      {/* <div className="form-group w-full lg:w-1/3 px-4 py-0 my-2 lg:mx-0">
        <label htmlFor="street" className="font-bold">
          Street
          <span className="tex-red-500"></span>
        </label>
        <input
          type="text"
          id="street"
          value={facilityData.facilityLocation.street || ""}
          placeholder="Enter street"
          className="w-full outline-none border"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAddress((prev) => ({
              ...prev,
              street: String(e.target.value),
            }))
          }
        />
      </div> */}

      {/* plotNumber */}
      {/* <div className="form-group w-full lg:w-1/3 px-4 py-0 my-2 lg:mx-0">
        <label htmlFor="plotNumber" className="font-bold">
          Plot number
          <span className="tex-red-500"></span>
        </label>
        <input
          type="text"
          id="plotNumber"
          value={facilityData.facilityLocation.plotNumber || ""}
          placeholder="Enter plotNumber"
          className="w-full outline-none border"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAddress((prev) => ({
              ...prev,
              plotNumber: String(e.target.value),
            }))
          }
        />
      </div> */}
    </>
  );
};
export default React.memo(AddressForm);
