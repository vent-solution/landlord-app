import React from "react";
import { CreationFacilitiesModel } from "../../modules/facilities/FacilityModel";
import markRequiredFormField from "../validation/markRequiredFormField";

interface Props {
  setData: React.Dispatch<React.SetStateAction<CreationFacilitiesModel>>;
  data: CreationFacilitiesModel;
}

let ContactForm: React.FC<Props> = ({ setData, data }) => {
  return (
    <>
      {/* telephone*/}
      <div className="form-group w-full lg:w-1/2 px-4 py-0 my-2 lg:mx-0">
        <label htmlFor="telephone1" className="font-bold">
          Telephone (Include country code eg. +234...)
          <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="telephone1"
          id="telephone1"
          placeholder="Enter telephone 1 (eg. +234...)"
          className="w-full outline-none border"
          onChange={(phone) => {
            markRequiredFormField(phone.target);
            setData({
              ...data,
              contact: {
                ...data.contact,
                telephone1: phone.target.value,
              },
            });
          }}
        />

        <small className="text-red-500">Telephone1 is required!</small>
      </div>

      {/* whatsapp*/}
      {/* <div className="form-group w-full lg:w-1/2 px-4 py-0 my-2 lg:mx-0">
        <label htmlFor="plotNumber" className="font-bold">
          Telephone2
          <span className="tex-red-500"></span>
        </label>
        <input
          type="text"
          name="telephone2"
          id="telephone2"
          placeholder="Enter telephone2 (eg. +234...)"
          className="w-full outline-none border"
          onChange={(phone) => {
            markRequiredFormField(phone.target);
            setData({
              ...data,
              contact: {
                ...data.contact,
                telephone2: phone.target.value,
              },
            });
          }}
        />
      </div> */}

      {/* email */}
      <div className="form-group w-full lg:w-1/2 px-4 py-0 my-2 lg:mx-0">
        <label htmlFor="plotNumber" className="font-bold">
          Email
          <span className="tex-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          value={data.contact.email || ""}
          placeholder="Enter email (example@domain.com)"
          className="w-full outline-none border"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            markRequiredFormField(e.target);
            setData({
              ...data,
              contact: {
                ...data.contact,
                email: String(e.target.value),
              },
            });
          }}
        />
        <small className="text-red-500">Email is required!</small>
      </div>

      {/* fax */}
      {/* <div className="form-group w-full lg:w-1/2 px-4 py-0 my-2 lg:mx-0">
        <label htmlFor="plotNumber" className="font-bold">
          Fax
          <span className="tex-red-500"></span>
        </label>
        <input
          type="text"
          id="fax"
          value={data.contact.fax || ""}
          placeholder="Enter fax"
          className="w-full outline-none border"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setData({
              ...data,
              contact: {
                ...data.contact,
                fax: String(e.target.value),
              },
            })
          }
        />
      </div> */}
    </>
  );
};

ContactForm = React.memo(ContactForm);

export default ContactForm;
