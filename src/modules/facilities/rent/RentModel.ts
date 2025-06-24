import { TenantModel } from "../../tenants/TenantModel";
import { AccommodationModel } from "../accommodations/AccommodationModel";
import { FacilitiesModel } from "../FacilityModel";

export interface RentModel {
  rentId?: number;
  price: number | null;
  amount: number;
  dollarRate: number;
  facilityCurrencyRate: number;
  currency: string;
  paymentType: string;
  transactionDate: string;
  periods: number;
  balance: number;
  transactionStatus?: string;
  dateCreated?: string;
  lastUpdated?: string;
  tenant: TenantModel;
  accommodation: AccommodationModel;
}

// CREATION RENT MODEL
export interface CreationRentModel {
  price: number | null;
  amount: number | null;
  dollarRate: number | null;
  facilityCurrencyRate: number | null;
  currency: string | null;
  paymentType: string | null;
  transactionDate?: string | null;
  transactionStatus?: string | null;
  dateCreated?: string | null;
  lastUpdated?: string | null;
  tenant?: { tenantId: number | null };
  accommodation?: {
    accommodationId: number | null;
    accommodationNumber: string | null;
  };
}
