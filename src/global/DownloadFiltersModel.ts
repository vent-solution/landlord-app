export interface downloadFilters {
  limit?: number;
  startDate?: Date | null;
  endDate?: Date | null;
  ownerId?: number | null;
  facilityId?: number | null;
  tenantId?: number | null;
}
