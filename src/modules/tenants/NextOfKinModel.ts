import { AddressModel } from "../../global/models/AddressModel";

export interface NextOfKinModel {
  nokName?: string;
  nokEmail?: string;
  nokTelephone?: string;
  nokNationalId?: string;
  nokIdType?: string;
  addressType?: string;
  address?: AddressModel;
}
