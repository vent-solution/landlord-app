import { UserModel } from "../users/models/userModel";

export interface SubscriptionModel {
  subscriptionId: string;
  transactionNumber: string;
  amount: number;
  currency: string;
  paymentType: string;
  transactionDate: string;
  transactionStatus: string;
  dateCreated: string;
  lastUpdated: string;
  user?: UserModel;
}

export interface SubscriptionCreationModel {
  transactionNumber: string | null;
  amount: number | null;
  currency: string | null;
  paymentType: string | null;
  transactionDate: string | null;
  user?: { userId: number | null };
}
