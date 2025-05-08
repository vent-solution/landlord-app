import { UserModel } from "../users/models/userModel";
import { NextOfKinModel } from "./NextOfKinModel";

export interface TenantModel {
  tenantId: number;
  nationalId: string;
  idType?: string;
  nextOfKin?: NextOfKinModel;
  dateCreated?: string;
  lastUpdated?: string;
  user: UserModel;
  companyName: string;
}

export interface TenantCreationModel {
  nationalId: string;
  idType?: string;
  nextOfKin?: NextOfKinModel;
  user: { userId: number };
  companyName: string;
}
