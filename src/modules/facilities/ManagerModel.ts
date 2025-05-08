import { AddressModel } from "../../global/models/AddressModel";
import { ContactModel } from "../../global/models/ContactModel";
import { UserModel } from "../users/models/userModel";

export interface ManagerModel {
  managerId?: number;
  idType: string;
  nationalId: string;
  contactType: string;
  contact: ContactModel;
  addressType: string;
  address: AddressModel;
  dateCreated?: string;
  lastUpdated?: string;
  user?: UserModel;
}
