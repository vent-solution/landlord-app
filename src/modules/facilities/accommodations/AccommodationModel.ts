import { TenantModel } from "../../tenants/TenantModel";
import { FacilitiesModel } from "../FacilityModel";

export interface AccommodationModel {
  accommodationId?: number;
  accommodationNumber: string;
  floor?: string;
  price: number;
  bedrooms?: number;
  fullyFurnished?: boolean;
  selfContained?: boolean;
  accommodationCategory: string;
  accommodationType: string;
  genderRestriction: string;
  capacity?: number;
  availability: string;
  paymentPartten: string;
  numberOfBedRooms?: number;
  roomLocation?: string;
  numberOfwashRooms?: number;
  dateCreated?: string;
  lastUpdated?: string;
  facility: FacilitiesModel;
  tenants?: TenantModel[];
  description: string;
}

export interface AccommodationCreationModel {
  accommodationNumber: string | null;
  floor?: string | null;
  price: number | null;
  bedrooms?: number | null;
  fullyFurnished?: boolean;
  selfContained?: boolean;
  accommodationCategory: string | null;
  accommodationType: string | null;
  genderRestriction: string | null;
  capacity?: number | null;
  paymentPartten: string | null;
  roomLocation?: string | null;
  numberOfwashRooms?: number | null;
  facility: { facilityId: number };
  description: string | null;
}
