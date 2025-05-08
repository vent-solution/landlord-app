import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchData } from "../../../global/api";
import { RentModel } from "../rent/RentModel";

interface StateModel {
  facilityRent: RentModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idle" | "succeeded" | "loading" | "failed";
  error: string | null;
}

const initialState: StateModel = {
  facilityRent: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

export const fetchfacilityRent = createAsyncThunk(
  "fetchFacilityRent",
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
        `/fetch-rent-by-facility/${facilityId}/${page}/${size}`
      );

      if (
        (result.data.status && result.data.status !== "OK") ||
        result.status !== 200
      ) {
        return initialState;
      }
      return result.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH FACILITY RENT CANCELLED: ", error.message);
      }
    }
  }
);

const facilityRentSlice = createSlice({
  name: "facilityRent",
  initialState,
  reducers: {
    resetFacilityRent: {
      reducer: (state, action: PayloadAction<StateModel>) => {
        state.facilityRent = action.payload.facilityRent;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      },

      prepare: (facilityRentState: StateModel) => {
        return { payload: facilityRentState };
      },
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchfacilityRent.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchfacilityRent.fulfilled,
        (state, action: PayloadAction<StateModel>) => {
          state.facilityRent = action.payload.facilityRent;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchfacilityRent.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getFacilityRent = (state: { facilityRent: StateModel }) =>
  state.facilityRent;

export const { resetFacilityRent } = facilityRentSlice.actions;

export default facilityRentSlice.reducer;
