import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FacilitiesModel } from "../facilities/FacilityModel";
import { fetchData } from "../../global/api";
import axios from "axios";

interface StateModel {
  otherFacilities: FacilitiesModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: StateModel = {
  otherFacilities: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

export const fetchOtherFacilities = createAsyncThunk(
  "fetchOtherFacilities",
  async ({ page, size }: { page: number; size: number }) => {
    try {
      const result = await fetchData(`/fetch-facilities/${page}/${size}`);

      if (!result) {
        console.log("ERROR OCCURRED.");
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
        console.log("FETCH OTHER FACILITIES CANCELLED: ", error.message);
      }
    }
  }
);

const otherFacilitiesSlice = createSlice({
  name: "otherFacilities",
  initialState,
  reducers: {
    resetOtherFacilities: {
      reducer(state, action: PayloadAction<StateModel>) {
        state.otherFacilities = action.payload.otherFacilities;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      },

      prepare(facilitiesState: StateModel) {
        return { payload: facilitiesState };
      },
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchOtherFacilities.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchOtherFacilities.fulfilled,
        (state, action: PayloadAction<StateModel>) => {
          state.otherFacilities = action.payload.otherFacilities;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchOtherFacilities.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { resetOtherFacilities } = otherFacilitiesSlice.actions;

export const getOtherFacilities = (state: { otherFacilities: StateModel }) =>
  state.otherFacilities;

export default otherFacilitiesSlice.reducer;
