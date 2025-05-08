import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HistoryModel } from "./HistoryModel";
import axios from "axios";
import { fetchData } from "../../../global/api";

interface StateModel {
  facilityHistory: HistoryModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: StateModel = {
  facilityHistory: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

export const fetchFacilityHistory = createAsyncThunk(
  "fetchFacilityHistory",
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
        `/fetch-history-by-facility/${facilityId}/${page}/${size}`
      );

      if (!result) {
        return initialState;
      }

      if (
        (result.data.status && result.data.status !== "Ok") ||
        result.status !== 200
      ) {
        return initialState;
      }

      return result.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH FACILITY HISTORY CANCELLED: ", error.message);
      }
    }
  }
);

const facilityHistorySlice = createSlice({
  name: "facilityHistory",
  initialState,
  reducers: {
    resetFacilityHistory: {
      reducer: (state, action: PayloadAction<StateModel>) => {
        state.facilityHistory = action.payload.facilityHistory;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      },

      prepare: (facilityHistory: StateModel) => {
        return { payload: facilityHistory };
      },
    },

    addHistory: {
      reducer: (state, action: PayloadAction<HistoryModel>) => {
        state.totalElements += 1;
        state.facilityHistory = [action.payload, ...state.facilityHistory];
      },

      prepare: (history: HistoryModel) => ({ payload: history }),
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchFacilityHistory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchFacilityHistory.fulfilled,
        (state, action: PayloadAction<StateModel>) => {
          state.facilityHistory = action.payload.facilityHistory;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchFacilityHistory.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getFacilityHistory = (state: { facilityHistory: StateModel }) =>
  state.facilityHistory;

export const { resetFacilityHistory, addHistory } =
  facilityHistorySlice.actions;

export default facilityHistorySlice.reducer;
