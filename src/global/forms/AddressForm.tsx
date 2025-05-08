import React from "react";
import { CreationFacilitiesModel } from "../../modules/facilities/FacilityModel";
import CountrySelect from "../formFields/CountrySelectField";

interface CountryOption {
  label: string; // What gets displayed
  value: string; // A value representing the country, like ISO code
  flag: string; // Flag URL for display in custom option rendering
}

interface Props {
  handleCountryChange: (selectedOption: CountryOption | null) => void;

  facilityData: CreationFacilitiesModel;
  selectedCountry: CountryOption | null;

  setAddress: React.Dispatch<
    React.SetStateAction<{
      country: string | null;
      state: string | null;
      city: string | null;
      county: string | null;
      division: string | null;
      parish: string | null;
      zone: string | null;
      street: string | null;
      plotNumber: string | null;
    }>
  >;
}

const AddressForm: React.FC<Props> = ({
  handleCountryChange,
  facilityData,
  selectedCountry,
  setAddress,
}) => {
  return (
    <>
      {/* Country */}
      <div className="form-group w-full lg:w-1/3 px-4 py-5 my-2 lg:mx-0">
        <label htmlFor="facilityCategory" className="font-bold">
          Country <span className="tex-red-500">*</span>
        </label>
        <CountrySelect
          changeCountry={handleCountryChange}
          selectedCountry={selectedCountry}
          setAddress={setAddress}
        />

        <small className="w-full text-red-600">Country is required</small>
      </div>

      {/* state*/}
      <div className="form-group w-full lg:w-1/3 px-4 py-5 my-2 lg:mx-0">
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
      </div>

      {/* city*/}
      <div className="form-group w-full lg:w-1/3 px-4 py-5 my-2 lg:mx-0">
        <label htmlFor="city" className="font-bold">
          City/District/Municipality
          <span className="tex-red-500">*</span>
        </label>
        <input
          type="text"
          id="city"
          value={facilityData.facilityLocation.city || ""}
          placeholder="Enter state"
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
      <div className="form-group w-full lg:w-1/3 px-4 py-5 my-2 lg:mx-0">
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
      </div>

      {/* division */}
      <div className="form-group w-full lg:w-1/3 px-4 py-5 my-2 lg:mx-0">
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
      </div>

      {/* parish */}
      <div className="form-group w-full lg:w-1/3 px-4 py-5 my-2 lg:mx-0">
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
      </div>

      {/* zone */}
      <div className="form-group w-full lg:w-1/3 px-4 py-5 my-2 lg:mx-0">
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
      </div>

      {/* street */}
      <div className="form-group w-full lg:w-1/3 px-4 py-5 my-2 lg:mx-0">
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
      </div>

      {/* plotNumber */}
      <div className="form-group w-full lg:w-1/3 px-4 py-5 my-2 lg:mx-0">
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
      </div>
    </>
  );
};

export default AddressForm;
