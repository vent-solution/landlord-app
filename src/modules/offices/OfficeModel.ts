import { AddressModel } from "../../global/models/AddressModel";
import { ContactModel } from "../../global/models/ContactModel";
import { UserModel } from "../users/models/userModel";

export interface OfficeModel {
  officeId?: string;
  officeLocation: AddressModel;
  officeContact: ContactModel;
  officeOwner: UserModel;
  dateCreated?: string;
  lastUpdated?: string;
}
