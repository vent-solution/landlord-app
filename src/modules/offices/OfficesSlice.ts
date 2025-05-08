import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OfficeModel } from "./OfficeModel";
import axios from "axios";
import { fetchData } from "../../global/api";

interface UpdateModel {
  id: string | undefined;
  changes: OfficeModel;
}

interface OfficesState {
  offices: OfficeModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idle" | "failed" | "succeeded" | "loading";
  error: string | null;
}

const initialState: OfficesState = {
  offices: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

export const fetchOffices = createAsyncThunk(
  "fetchOffices",
  async ({
    owner_id,
    page,
    size,
  }: {
    owner_id: number;
    page: number;
    size: number;
  }) => {
    try {
      const result = await fetchData(
        `/fetch-offices/${owner_id}/${page}/${size}`
      );

      console.log(result);

      if (!result) {
        return initialState;
      }

      if (
        (result.data.status && result.data.status !== "OK") ||
        result.status !== 200
      ) {
        return initialState;
      } else {
        return result.data;
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH OFFICES CANCELLED ", error.message);
      }
    }
  }
);

const OfficeSlice = createSlice({
  name: "offices",
  initialState,
  reducers: {
    // add a new office
    addOffice: {
      reducer(state, action: PayloadAction<OfficeModel>) {
        state.offices.push(action.payload);
        state.totalPages += 1;
      },
      prepare(office: OfficeModel) {
        return { payload: office };
      },
    },

    // reset offices
    resetOffices: {
      reducer(state, action: PayloadAction<OfficesState>) {
        state.offices = action.payload.offices;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      },
      prepare(offices: OfficesState) {
        return { payload: offices };
      },
    },

    // delete office
    deleteOffice: {
      reducer(state, action: PayloadAction<string | undefined>) {
        state.offices = state.offices.filter(
          (office) => office.officeId !== action.payload
        );
      },
      prepare(officeId: string | undefined) {
        return { payload: officeId };
      },
    },

    // update office
    updateOffice: {
      reducer(state, action: PayloadAction<UpdateModel>) {
        const { id, changes } = action.payload;
        const officeIndex = state.offices.findIndex(
          (office) => (office.officeId = id)
        );
        if (officeIndex >= 0) {
          state.offices[officeIndex] = {
            ...state.offices[officeIndex],
            ...changes,
          };
        }
      },
      prepare(changes: UpdateModel) {
        return { payload: changes };
      },
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchOffices.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchOffices.fulfilled,
        (state, action: PayloadAction<OfficesState>) => {
          state.offices = action.payload.offices;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchOffices.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getOffices = (state: { offices: OfficesState }) => state.offices;

export const getOfficeById = (
  sate: { offices: OfficesState },
  officeId: number
) =>
  sate.offices.offices.find((office) => Number(office.officeId) === officeId);

export const { addOffice, resetOffices, deleteOffice, updateOffice } =
  OfficeSlice.actions;

export default OfficeSlice.reducer;
