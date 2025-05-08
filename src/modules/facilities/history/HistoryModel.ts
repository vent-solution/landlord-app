import { TenantModel } from "../../tenants/TenantModel";
import { AccommodationModel } from "../accommodations/AccommodationModel";

export interface HistoryModel {
  historyId?: number;
  tenant: TenantModel;
  accommodation: AccommodationModel;
  checkIn?: string;
  checkOut?: string;
  status?: string;
}
