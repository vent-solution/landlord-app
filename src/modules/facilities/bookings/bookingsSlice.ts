import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BookingModel } from "./BookingModel";
import axios from "axios";
import { fetchData } from "../../../global/api";

interface StateModel {
  facilityBookings: BookingModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idle" | "succeeded" | "loading" | "failed";
  error: string | null;
}

const initialState: StateModel = {
  facilityBookings: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

export const fetchFacilityBookings = createAsyncThunk(
  "fetchFacilityBookings",
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
        `/fetch-bookings-by-facility/${facilityId}/${page}/${size}`
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
        console.log("FETCH FACILITY BOOKINGS CANCELLED: ", error.message);
      }
    }
  }
);

const facilityBookingsSlice = createSlice({
  name: "facilityBookings",
  initialState,
  reducers: {
    resetFacilityBookings: {
      reducer: (state, action: PayloadAction<StateModel>) => {
        state.facilityBookings = action.payload.facilityBookings;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      },
      prepare: (facilityBookingsState: StateModel) => {
        return { payload: facilityBookingsState };
      },
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchFacilityBookings.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchFacilityBookings.fulfilled,
        (state, action: PayloadAction<StateModel>) => {
          state.facilityBookings = action.payload.facilityBookings;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchFacilityBookings.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getFacilityBookings = (state: { facilityBookings: StateModel }) =>
  state.facilityBookings;

export const { resetFacilityBookings } = facilityBookingsSlice.actions;

export default facilityBookingsSlice.reducer;
