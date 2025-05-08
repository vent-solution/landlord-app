import { UserModel } from "../users/models/userModel";
import { LogStatusEnum } from "./LogStatusEnum";

export interface LogModel {
  logId: string;
  activity: string;
  description: string;
  status: LogStatusEnum;
  dateCreated: string;
  user?: UserModel;
}
