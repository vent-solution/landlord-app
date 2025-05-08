import { UserModel } from "../../users/models/userModel";
import { FacilitiesModel } from "../FacilityModel";

export interface ExpenseModel {
  expenseId: number;
  description: string;
  amount: number;
  currency: string;
  receiptNumber: string;
  transactionDate: string;
  dateCreated: Date;
  lastUpdated: Date;
  facility: FacilitiesModel;
  addedBy: UserModel;
}

export interface ExpenseCreationModel {
  description: string | null;
  amount: number | null;
  currency: string | null;
  receiptNumber: string | null;
  transactionDate: string | null;
  facility: { facilityId: number | null };
  addedBy: { userId: number | null };
}
