import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BidModel } from "../../bids/BidModel";
import axios from "axios";
import { fetchData } from "../../../global/api";

interface StateModel {
  facilityBids: BidModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idle" | "succeeded" | "loading" | "failed";
  error: string | null;
}

const initialState: StateModel = {
  facilityBids: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

export const fetchFacilityBids = createAsyncThunk(
  "fetchFacilityBids",
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
        `/fetch-bids-by-facility/${facilityId}/${page}/${size}`
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
        console.log("FETCH FACILITY BIDS CANCELLED: ", error.message);
      }
    }
  }
);

const facilityBidsSlice = createSlice({
  name: "facilityBids",
  initialState,
  reducers: {
    resetFacilityBids: {
      reducer: (state, action: PayloadAction<StateModel>) => {
        state.facilityBids = action.payload.facilityBids;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      },
      prepare: (facilityBidsState: StateModel) => {
        return { payload: facilityBidsState };
      },
    },
  },

  // extra reducers
  extraReducers: (builder) => {
    builder
      .addCase(fetchFacilityBids.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchFacilityBids.fulfilled,
        (state, action: PayloadAction<StateModel>) => {
          state.facilityBids = action.payload.facilityBids;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchFacilityBids.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getFacilityBids = (state: { facilityBids: StateModel }) =>
  state.facilityBids;

export const { resetFacilityBids } = facilityBidsSlice.actions;

export default facilityBidsSlice.reducer;
