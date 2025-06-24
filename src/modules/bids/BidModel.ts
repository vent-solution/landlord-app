import { FacilitiesModel } from "../facilities/FacilityModel";
import { UserModel } from "../users/models/userModel";

export interface BidModel {
  bidId?: string;
  bidAmount: number;
  dollarRate: string;
  desiredCurrencyRate: string;
  transactionCurrencyRate: string;
  currency: string;
  paymentType: string;
  dateCreated: string;
  lastUpdated?: string;
  facility: FacilitiesModel;
  paidBy: UserModel;
}

export interface BidCreationModel {
  bidAmount: number | null;
  dollarRate: string | null;
  desiredCurrencyRate: string | null;
  transactionCurrencyRate: string | null;

  currency: string | null;
  paymentType: string | null;
  facility: { facilityId: number | null };
  paidBy: { userId: number | null };
}
