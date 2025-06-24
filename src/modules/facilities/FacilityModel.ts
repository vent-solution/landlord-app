import { LandlordModel } from "../auth/landlordModel";
import { TenantModel } from "../tenants/TenantModel";
import { UserModel } from "../users/models/userModel";
import { AmenitiesModel } from "./AmenitiesModel";
export interface FacilitiesModel {
  facilityId: number;
  facilityCategory: string;
  facilityName: string;
  facilityLocation: {
    primaryAddress: string;
    country: string;
    city: string;
    latitude: string;
    longitude: string;
    distance: string;
  };
  contact: {
    telephone1: string;
    email: string;
  };
  genderRestriction: string;
  businessType: string;
  dateCreated: string;
  lastUpdated: string;
  facilityAmenities?: AmenitiesModel | null;
  facilityImages?: string[];
  manager: UserModel;
  preferedCurrency: string;
  price?: number;
  bookingPercentage: number;
  bidAmount?: number;
  tenants: TenantModel[];
  description?: string | null;
  facilityRating?: string;
  facilityStatus?: string | null;
  landlord?: LandlordModel;
}

export interface CreationFacilitiesModel {
  landlord: { landlordId: number | null };
  facilityCategory: string | null;
  facilityName: string | null;
  facilityLocation: {
    primaryAddress?: string | null;
    country?: string | null;
    city?: string | null;
  };
  contact: {
    telephone1?: string | null;
    email?: string | null;
  };
  genderRestriction: string | null;
  businessType: string | null;
  facilityImages?: string[] | null;
  manager?: { managerId: number | null };
  preferedCurrency: string | null;
  price?: number | null;
  bookingPercentage: number | null;
  bidAmount?: number | null;
  description?: string | null;
  facilityAmenities?: AmenitiesModel | null;
  facilityRating?: string | null;
  facilityStatus?: string | null;
}
