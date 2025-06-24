import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AccommodationModel } from "./AccommodationModel";
import axios from "axios";
import { fetchData } from "../../../global/api";
import { AccommodationAvailability } from "../../../global/enums/accommodationAvailability";

interface UpdateModel {
  id: number;
  changes: AccommodationModel;
}

interface StateModel {
  facilityAccommodations: AccommodationModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: StateModel = {
  facilityAccommodations: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

export const fetchAccommodationsByFacility = createAsyncThunk(
  "fetchAccommodationsByFacility",
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
        `/fetch-accommodations-by-facility/${facilityId}/${page}/${size}`
      );

      if (!result) {
        return initialState;
      }

      if (
        (result.data.status && result.data.status !== "OK") ||
        result.status !== 200
      ) {
        return initialState;
      }
      return result.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(
          "FETCH ACCOMMODATIONS BY FACILITY CANCELLED: ",
          error.message
        );
      }
    }
  }
);

const accommodationsSlice = createSlice({
  name: "facilityAccommodations",
  initialState,
  reducers: {
    // reseting the list of existing accommodations
    resetFacilityAccommodations: {
      reducer: (state, action: PayloadAction<StateModel>) => {
        state.facilityAccommodations = action.payload.facilityAccommodations;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      },

      prepare: (accommodationsState: StateModel) => {
        return { payload: accommodationsState };
      },
    },

    //adding a new accommodation
    addAccommodation: {
      reducer: (state, action: PayloadAction<AccommodationModel>) => {
        state.facilityAccommodations.push(action.payload);
        state.totalElements += 1;
      },

      prepare: (accommodationState: AccommodationModel) => {
        return { payload: accommodationState };
      },
    },

    // updating accommodation
    updateAccommodation: {
      reducer: (state, action: PayloadAction<UpdateModel>) => {
        const { id, changes } = action.payload;

        const accommodationIndex = state.facilityAccommodations.findIndex(
          (accommodation) =>
            Number(accommodation.accommodationId) === Number(id)
        );

        if (accommodationIndex >= 0) {
          state.facilityAccommodations[accommodationIndex] = {
            ...state.facilityAccommodations[accommodationIndex],
            ...changes,
          };
        }
      },

      prepare: (accommodation: UpdateModel) => {
        return { payload: accommodation };
      },
    },

    // deleting accommodation
    deleteAccommodation: {
      reducer: (state, action: PayloadAction<number>) => {
        state.totalElements -= 1;
        state.facilityAccommodations = state.facilityAccommodations.filter(
          (accommodation) =>
            Number(accommodation.accommodationId) !== Number(action.payload)
        );
      },

      prepare: (accommodationId: number) => {
        return { payload: accommodationId };
      },
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAccommodationsByFacility.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchAccommodationsByFacility.fulfilled,
        (state, action: PayloadAction<StateModel>) => {
          state.facilityAccommodations = action.payload.facilityAccommodations;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchAccommodationsByFacility.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// get all available facility accommodations
export const getFacilityAccommodations = (state: {
  facilityAccommodations: StateModel;
}) => state.facilityAccommodations;

// get accommodation by ID
export const getAccommodationById =
  (accommodationId: number) =>
  (state: { facilityAccommodations: StateModel }) =>
    state.facilityAccommodations.facilityAccommodations.find(
      (accommodation) => accommodation.accommodationId === accommodationId
    );

// get accommodation by tenant
export const getAccommodationByTenant =
  (tenantId: number) => (state: { facilityAccommodations: StateModel }) =>
    state.facilityAccommodations.facilityAccommodations.find(
      (fc) =>
        fc.tenants &&
        fc.tenants.find((tnt) => Number(tnt.tenantId) === tenantId)
    );

export const getAccommodationByIdAndTenant =
  (tenanId: number, accommodationID: number) =>
  (state: { facilityAccommodations: StateModel }) =>
    state.facilityAccommodations.facilityAccommodations.find((fc) =>
      fc.tenants?.find(
        (tnt) =>
          Number(tnt.tenantId === tenanId) &&
          fc.accommodationId === accommodationID
      )
    );

export const getAvailableAccommodations = (state: {
  facilityAccommodations: StateModel;
}) =>
  state.facilityAccommodations.facilityAccommodations.filter(
    (accommodation) =>
      accommodation.availability === AccommodationAvailability.available
  );

export const {
  resetFacilityAccommodations,
  addAccommodation,
  updateAccommodation,
  deleteAccommodation,
} = accommodationsSlice.actions;

export default accommodationsSlice.reducer;
