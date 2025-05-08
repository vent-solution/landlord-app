import React from "react";
import PhoneInput from "react-phone-input-2";
import { CreationFacilitiesModel } from "../../modules/facilities/FacilityModel";

interface Props {
  setData: React.Dispatch<React.SetStateAction<CreationFacilitiesModel>>;
  data: CreationFacilitiesModel;
}

let ContactForm: React.FC<Props> = ({ setData, data }) => {
  return (
    <>
      {/* telephone*/}
      <div className="form-group w-full lg:w-1/2 px-4 py-5 my-2 lg:mx-0">
        <label htmlFor="telephone1" className="font-bold">
          Telephone
          <span className="text-red-500">*</span>
        </label>
        <PhoneInput
          country={"us"}
          value={data.contact.telephone1}
          placeholder="Enter telephone 1"
          onChange={(phone) => {
            setData({
              ...data,
              contact: {
                ...data.contact,
                telephone1: phone ? "+" + phone : null,
              },
            });
          }}
          inputStyle={{
            width: "100%",
            padding: "10px 50px",
            fontSize: "16px",
            borderRadius: "4px",
          }}
          containerStyle={{
            width: "100%",
            display: "flex",
            alignItems: "center", // To keep the phone number and country code in the same line
          }}
        />
      </div>

      {/* whatsapp*/}
      <div className="form-group w-full lg:w-1/2 px-4 py-5 my-2 lg:mx-0">
        <label htmlFor="plotNumber" className="font-bold">
          WhatsApp
          <span className="tex-red-500"></span>
        </label>
        <PhoneInput
          country={"us"} // Default country code (optional)
          value={data.contact.telephone2}
          placeholder="Enter telephone 2"
          onChange={(phone) => {
            setData({
              ...data,
              contact: {
                ...data.contact,
                telephone2: phone ? "+" + phone : null,
              },
            });
          }}
          inputStyle={{
            width: "100%",
            padding: "10px 50px",
            fontSize: "16px",
            borderRadius: "4px",
          }}
        />
      </div>

      {/* email */}
      <div className="form-group w-full lg:w-1/2 px-4 py-5 my-2 lg:mx-0">
        <label htmlFor="plotNumber" className="font-bold">
          Email
          <span className="tex-red-500"></span>
        </label>
        <input
          type="email"
          id="email"
          value={data.contact.email || ""}
          placeholder="Enter email"
          className="w-full outline-none border"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setData({
              ...data,
              contact: {
                ...data.contact,
                email: String(e.target.value),
              },
            })
          }
        />
      </div>

      {/* fax */}
      <div className="form-group w-full lg:w-1/2 px-4 py-5 my-2 lg:mx-0">
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
      </div>
    </>
  );
};

ContactForm = React.memo(ContactForm);

export default ContactForm;
