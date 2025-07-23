import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchData } from "../../../global/api";
import { HistoryModel } from "../history/HistoryModel";

interface StateModel {
  facilityTenants: HistoryModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idle" | "succeeded" | "loading" | "failed";
  error: string | null;
}

const initialState: StateModel = {
  facilityTenants: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

export const fetchFacilityTenants = createAsyncThunk(
  "fetchTenants",
  async ({
    facilityId,
    page,
    size,
  }: {
    facilityId: number;
    page: number;
    size: number;
  }) => {
    try {
      const result = await fetchData(
        `/fetch-facility-tenants/${facilityId}/${page}/${size}`
      );

      if (
        !result ||
        (result.data.status && result.data.status !== "OK") ||
        result.status !== 200
      ) {
        return initialState;
      }
      return result.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH TENANTS CANCELLED: ", error.message);
        return initialState;
      }
    }
  }
);

const facilityTenantsSlice = createSlice({
  name: "facilityTenants",
  initialState,
  reducers: {
    addFacilityTenant: {
      reducer: (state, action: PayloadAction<HistoryModel>) => {
        state.facilityTenants = [...state.facilityTenants, action.payload];
      },
      prepare: (tenantsState: HistoryModel) => {
        return { payload: tenantsState };
      },
    },

    deleteTenant: {
      reducer: (state, action: PayloadAction<number[]>) => {
        state.facilityTenants = state.facilityTenants.filter(
          (history) =>
            history.tenant.tenantId !== action.payload[0] &&
            history.accommodation.accommodationId !== action.payload[1]
        );
      },
      prepare: (IDs: number[]) => {
        return { payload: IDs };
      },
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchFacilityTenants.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchFacilityTenants.fulfilled,
        (state, action: PayloadAction<StateModel>) => {
          state.facilityTenants = action.payload.facilityTenants;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchFacilityTenants.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getFacilityTenants = (state: { facilityTenants: StateModel }) =>
  state.facilityTenants;

export const getHistoryByAccommodationId =
  (accommodationId: number) => (state: { facilityTenants: StateModel }) =>
    state.facilityTenants.facilityTenants.filter(
      (tenant) =>
        Number(tenant.accommodation.accommodationId) === accommodationId &&
        tenant.status === "checkIn"
    );

export const getHistoryByTenantIdAndAccommodation =
  (tenantId: number, accommodationId: number) =>
  (state: { facilityTenants: StateModel }) =>
    state.facilityTenants.facilityTenants.find(
      (history) =>
        Number(history.tenant.tenantId) === tenantId &&
        Number(history.accommodation.accommodationId) === accommodationId
    );

export const { addFacilityTenant, deleteTenant } = facilityTenantsSlice.actions;

export default facilityTenantsSlice.reducer;
