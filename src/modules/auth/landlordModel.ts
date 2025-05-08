import { AddressModel } from "../../global/models/AddressModel";
import { UserModel } from "../users/models/userModel";

export interface LandlordModel {
  landlordId?: number;
  companyName?: string;
  idType?: string;
  nationalId?: string;
  addressType?: string;
  address?: AddressModel;
  dateCreated?: string;
  lastUpdated?: string;
  user?: UserModel;
}

export interface LandlordCreationModel {
  landlordId?: number;
  companyName?: string;
  idType?: string;
  nationalId?: string;
  addressType?: string;
  address?: AddressModel;
  dateCreated?: string;
  lastUpdated?: string;
  user?: { userId: number };
}
