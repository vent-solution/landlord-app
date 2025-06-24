import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FacilitiesModel } from "./FacilityModel";
import axios from "axios";
import { fetchData } from "../../global/api";

interface UpdateModel {
  id: number;
  changes: FacilitiesModel;
}

export interface FacilitiesState {
  facilities: FacilitiesModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idle" | "succeeded" | "failed" | "loading";
  error: string | null;
}

const initialState: FacilitiesState = {
  facilities: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

export const fetchFacilities = createAsyncThunk(
  "fetchFacilities",
  async ({
    userId,
    page,
    size,
  }: {
    userId: number;
    page: number;
    size: number;
  }) => {
    try {
      const result = await fetchData(
        `/fetch-facilities-by-landlord/${userId}/${page}/${size}`
      );

      if (!result) {
        return initialState;
      }

      if (result.data.status && result.data.status !== "OK") {
        return initialState;
      }

      return result.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH FACILITIES CANCELLED: ", error.message);
      }
    }
  }
);

const facilitiesSlice = createSlice({
  name: "facilities",
  initialState,
  reducers: {
    // resetting facilities
    resetFacilities: {
      reducer(state, action: PayloadAction<FacilitiesState>) {
        state.facilities = action.payload.facilities;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      },

      prepare(facilitiesState: FacilitiesState) {
        return { payload: facilitiesState };
      },
    },

    // adding a new facility
    addNewFacility: {
      reducer(state, action: PayloadAction<FacilitiesModel>) {
        state.facilities.push(action.payload);
        state.totalElements += 1;
      },

      prepare(facility: FacilitiesModel) {
        return { payload: facility };
      },
    },

    //updating facility info
    updateFacility: {
      reducer: (state, action: PayloadAction<UpdateModel>) => {
        const { id, changes } = action.payload;
        const facilityIndex = state.facilities.findIndex(
          (facility) => Number(facility.facilityId) === Number(id)
        );

        if (facilityIndex >= 0) {
          state.facilities[facilityIndex] = {
            ...state.facilities[facilityIndex],
            ...changes,
          };
        }
      },

      prepare: (facilityData: UpdateModel) => ({ payload: facilityData }),
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFacilities.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchFacilities.fulfilled,
        (state, action: PayloadAction<FacilitiesState>) => {
          state.facilities = action.payload.facilities;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchFacilities.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { resetFacilities, updateFacility, addNewFacility } =
  facilitiesSlice.actions;

export const getFacilities = (state: { facilities: FacilitiesState }) =>
  state.facilities;

export const findFacilityById =
  (facilityId: number) => (state: { facilities: FacilitiesState }) =>
    state.facilities.facilities.find(
      (facility) => Number(facility.facilityId) === Number(facilityId)
    );

export default facilitiesSlice.reducer;
