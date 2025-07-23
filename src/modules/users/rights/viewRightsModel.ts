import { UserModel } from "../models/userModel";

export interface ViewRightsModel {
  rightsId?: boolean;
  fullRights?: boolean;
  dashboard?: boolean;
  users?: boolean;
  tenants?: boolean;
  offices?: boolean;
  market?: boolean;
  receipts?: boolean;
  logs?: boolean;
  landlords?: boolean;
  staffs?: boolean;
  settings?: boolean;
  subscription?: boolean;
  brokerFees?: boolean;
  bids?: boolean;
  facilities?: boolean;
  statistics?: boolean;
  bookings?: boolean;
  expenses?: boolean;
  history?: boolean;
  accommodations?: boolean;
  rent?: boolean;
  user?: UserModel | null;
}
