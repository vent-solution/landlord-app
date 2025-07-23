import { TenantModel } from "../../tenants/TenantModel";
import { AccommodationModel } from "../accommodations/AccommodationModel";

export interface HistoryModel {
  historyId?: number;
  tenant: TenantModel;
  accommodation: AccommodationModel;
  checkIn?: string;
  expectedCheckOut?: string | null;
  checkOut?: string;
  status?: string;
}
