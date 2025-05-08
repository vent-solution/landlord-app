import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReceiptModel } from "./ReceiptModel";
import axios from "axios";
import { fetchData } from "../../global/api";

interface StateModel {
  receipts: ReceiptModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "loading" | "idle" | "succeeded" | "failed";
  error: string | null;
}

const initialState: StateModel = {
  receipts: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

export const fetchReceipts = createAsyncThunk(
  "fetchReceipts",
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
        `/fetch-receipts-by-landlord/${userId}/${page}/${size}`
      );

      if (result.data.status && result.data.status !== "OK") {
        console.log((await result).data.message);
        return initialState;
      }

      if (result.status !== 200) {
        console.log("Error fetching receipts by tenant.");
        return initialState;
      }

      return result.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH RECEIPTS BY TENANT CANCELLED: ", error.message);
      }
    }
  }
);

const receiptsSlice = createSlice({
  name: "receipts",
  initialState,
  reducers: {
    resetReceipts: {
      reducer(state, action: PayloadAction<StateModel>) {
        state.receipts = action.payload.receipts;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      },

      prepare(receiptsState: StateModel) {
        return { payload: receiptsState };
      },
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchReceipts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchReceipts.fulfilled,
        (state, action: PayloadAction<StateModel>) => {
          state.receipts = action.payload.receipts;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchReceipts.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload.error;
      });
  },
});

export const { resetReceipts } = receiptsSlice.actions;

export const getReceipts = (state: { receipts: StateModel }) => state.receipts;

export default receiptsSlice.reducer;
