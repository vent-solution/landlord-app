import { TenantModel } from "../../tenants/TenantModel";
import { AccommodationModel } from "../accommodations/AccommodationModel";

export interface BookingModel {
  bookingId?: number;
  amount: number;
  currency: string;
  paymentType: string;
  checkIn?: string;
  checkOut?: string;
  transactionDate: string;
  transactionStatus: string;
  dateCreated?: string;
  lastUpdated?: string;
  tenant: TenantModel;
  accommodation: AccommodationModel;
}

export interface BookingCreationModel {
  amount: number | null;
  currency: string;
  paymentType: string | null;
  checkIn?: string;
  checkOut?: string;
  transactionDate: string;
  transactionStatus: string;
  accommodation: { accommodationId: number | null };
}
