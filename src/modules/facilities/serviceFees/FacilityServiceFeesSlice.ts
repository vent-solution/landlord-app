import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ServiceFeeModel } from "../../serviceFees/ServiceFeeModel";
import axios from "axios";
import { fetchData } from "../../../global/api";

interface StateModel {
  facilityServiceFees: ServiceFeeModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: StateModel = {
  facilityServiceFees: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

export const fetchFacilityServiceFees = createAsyncThunk(
  "fetchFacilityServiceFees",
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
        `/fetch-service-fees-by-facility/${facilityId}/${page}/${size}`
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
        console.log("FETCH FACILITY SERVICE FEES CANCELLED: ", error.message);
      }
    }
  }
);

const facilityServiceFeesSlice = createSlice({
  name: "facilityServiceFees",
  initialState,
  reducers: {
    resetFacilityServiceFees: {
      reducer: (state, action: PayloadAction<StateModel>) => {
        state.facilityServiceFees = action.payload.facilityServiceFees;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      },

      prepare: (serviceFeesState: StateModel) => {
        return { payload: serviceFeesState };
      },
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchFacilityServiceFees.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchFacilityServiceFees.fulfilled,
        (state, action: PayloadAction<StateModel>) => {
          state.facilityServiceFees = action.payload.facilityServiceFees;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchFacilityServiceFees.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getFacilityServiceFees = (state: {
  facilityServiceFees: StateModel;
}) => state.facilityServiceFees;

export const { resetFacilityServiceFees } = facilityServiceFeesSlice.actions;

export default facilityServiceFeesSlice.reducer;
