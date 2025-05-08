import { UserModel } from "../users/models/userModel";

export interface ReceiptModel {
  receiptId: number;
  receiptNumber: string;
  transaction: string;
  amount: number;
  currency: string;
  paymentDate: string;
  balance: number;
  paymentMethod: string;
  period: number;
  paymentPattern: string;
  initialDate: string;
  description: string;
  dateCreated: string;
  issuer: UserModel;
  receiver: UserModel;
}
