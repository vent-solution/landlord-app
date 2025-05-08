export interface SettingsModel {
  id?: number;
  subscriptionFee: number;
  brokerFee: number;
  serviceFeeFreeRoom: number;
  serviceFeeOccupiedRoom: number;
  minimumBidFee: number;
  otherStaffServiceFee: number;
  preferedCurrency: string;
  dateCreated?: string;
  lastUpdated?: string;
}
