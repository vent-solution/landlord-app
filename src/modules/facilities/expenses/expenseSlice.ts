import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExpenseModel } from "./expenseModel";
import { fetchData } from "../../../global/api";
import axios from "axios";

interface stateModel {
  facilityExpenses: ExpenseModel[];
  page: number | null;
  size: number | null;
  totalElements: number | null;
  totalPages: number | null;
  status: "loading" | "failed" | "succeeded" | "idle";
  error: string | null;
}

const initialState: stateModel = {
  facilityExpenses: [],
  page: null,
  size: null,
  totalElements: null,
  totalPages: null,
  status: "idle",
  error: null,
};

export const fetchFacilityExpenses = createAsyncThunk(
  "fetchFacilityExpenses",
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
        `/fetch-facility-expenses/${facilityId}/${page}/${size}`
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
        console.log("FETCH FACILITY EXPENSES CANCELLED: ", error.message);
      }
    }
  }
);

const expenseSlice = createSlice({
  name: "facilityExpenses",
  initialState,
  reducers: {
    addNewExpense: {
      reducer: (state, action: PayloadAction<ExpenseModel>) => {
        if (
          state.facilityExpenses[0].facility.facilityId ===
          action.payload.facility.facilityId
        ) {
          state.facilityExpenses = [action.payload, ...state.facilityExpenses];
          state.totalElements = Number(state.totalElements) + 1;
        }
      },
      prepare: (expense: ExpenseModel) => {
        return { payload: expense };
      },
    },

    resetFacilityExpenses: {
      reducer: (state, action: PayloadAction<stateModel>) => {
        state.facilityExpenses = action.payload.facilityExpenses;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      },

      prepare: (expenses: stateModel) => {
        return { payload: expenses };
      },
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchFacilityExpenses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchFacilityExpenses.fulfilled,
        (state, action: PayloadAction<stateModel>) => {
          state.facilityExpenses = action.payload.facilityExpenses;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchFacilityExpenses.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { resetFacilityExpenses, addNewExpense } = expenseSlice.actions;

export const getFacilityExpenses = (state: { facilityExpenses: stateModel }) =>
  state.facilityExpenses;

export default expenseSlice.reducer;
