import { FacilitiesModel } from "../facilities/FacilityModel";
import { UserModel } from "../users/models/userModel";

export interface ServiceFeeModel {
  serviceFeeId?: number;
  amount: number;
  currency: string;
  paymentType: string;
  dateCreated?: string;
  facility: FacilitiesModel;
  paidBy: UserModel;
}

export interface ServiceFeeCreationModel {
  amount: number | null;
  currency: string | null;
  paymentType: string | null;
  transactionDate: string | null;
  facility: { facilityId?: number | null };
  paidBy: { userId?: number | null };
}
