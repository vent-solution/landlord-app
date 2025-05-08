import { FacilitiesModel } from "../facilities/FacilityModel";
import { UserModel } from "../users/models/userModel";

export interface BidModel {
  bidId?: string;
  bidAmount: number;
  currency: string;
  paymentType: string;
  dateCreated: string;
  lastUpdated?: string;
  facility: FacilitiesModel;
  paidBy: UserModel;
}

export interface BidCreationModel {
  bidAmount: number | null;
  currency: string | null;
  paymentType: string | null;
  facility: { facilityId: number | null };
  paidBy: { userId: number | null };
}
