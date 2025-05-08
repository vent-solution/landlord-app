export interface UserModel {
  userId?: string | null;
  userStatus?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  otherNames?: string | null;
  gender?: string | null;
  userRole?: string | null;
  userTelephone?: string | null;
  userEmail?: string | null;
  userPassword?: string | null;
  addedBy?: { userId: string | null };
  linkedTo?: { userId: string | null } | null;
  createdDate?: string | null;
  lastUpdated?: string | null;
}
