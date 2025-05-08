import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchData } from "../../global/api";
import { LogModel } from "./LogModel";

interface LogsState {
  userLogs: LogModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idel" | "failed" | "succeeded" | "loading";
  error: string | null;
}

const initialState: LogsState = {
  userLogs: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idel",
  error: null,
};

export const fetchLogs = createAsyncThunk(
  "fetchLogs",
  async (
    { userId, page, size }: { userId: number[]; page: number; size: number },
    { rejectWithValue }
  ) => {
    try {
      const result = await fetchData(
        `/fetch-landlord-user-logs/${userId}/${page}/${size}`
      );
      if (result.data.status && result.data.status !== "OK") {
        return initialState;
      }

      return result.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH LOGS CANCELLED ", error.message);
        return rejectWithValue("Fetch logs cancelled");
      }
      // Handle other errors, like network issues
      console.error("Error fetching logs: ", error);
      return rejectWithValue("Error: Unable to fetch logs");
    }
  }
);

const LogsSlice = createSlice({
  name: "logs",
  initialState,

  reducers: {
    // reset logs
    resetLogs: {
      reducer(state, action: PayloadAction<LogsState>) {
        state.userLogs = action.payload.userLogs;
        state.size = action.payload.size;
        state.page = action.payload.page;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      },

      prepare(logsState: LogsState) {
        return { payload: logsState };
      },
    },
  },

  // initial fetching of bids
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchLogs.fulfilled,
        (state, action: PayloadAction<LogsState>) => {
          state.userLogs = action.payload.userLogs;
          state.size = action.payload.size;
          state.page = action.payload.page;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchLogs.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getLogs = (state: { logs: LogsState }) => state.logs;

export const { resetLogs } = LogsSlice.actions;

export default LogsSlice.reducer;
