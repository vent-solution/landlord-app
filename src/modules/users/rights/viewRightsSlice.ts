// usersSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { ViewRightsModel } from "./viewRightsModel";
import { fetchData } from "../../../global/api";

// updateModel
// interface UpdateModel {
//   id: string | undefined;
//   changes: ViewRightsModel;
// }

// users state type
interface RightsState {
  viewRights: ViewRightsModel;
  status: string;
  error: string | null;
}

// initial users state
const initialState: RightsState = {
  viewRights: {
    fullRights: false,
    dashboard: false,
    facilities: false,
    users: false,
    tenants: false,
    offices: false,
    market: false,
    receipts: false,
    logs: false,
    landlords: false,
    staffs: false,
    settings: false,
    subscription: false,
    brokerFees: false,
    bids: false,
    statistics: false,
    bookings: false,
    expenses: false,
    history: false,
    accommodations: false,
    rent: false,
    user: {},
  },

  status: "idle",
  error: null,
};

// async thunk for fetching users
export const fetchViewRights = createAsyncThunk(
  "/fetchViewRights",
  async ({ userId }: { userId: number }) => {
    try {
      const result = await fetchData(`/fetch-view-rights/${userId}`);

      if (!result || result.data.length < 1) {
        return initialState.viewRights;
      }

      if (result.data.status && result.data.status !== "OK") {
        return initialState.viewRights;
      }
      return result.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH VIEW RIGHTS CANCELLED ", error.message);
      }
    }
  }
);

// create view rights slice
const viewRightsSlice = createSlice({
  name: "ViewRights",
  initialState,
  reducers: {
    updateViewRights: {
      reducer(state, action: PayloadAction<ViewRightsModel>) {
        state.viewRights = action.payload;
        state.status = "succeeded";
      },

      prepare(viewRights: ViewRightsModel) {
        return { payload: viewRights };
      },
    },
  },

  extraReducers: (builder) => {
    // fetching users
    builder
      .addCase(fetchViewRights.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchViewRights.fulfilled,
        (state, action: PayloadAction<ViewRightsModel>) => {
          state.status = "succeeded";
          state.viewRights = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchViewRights.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getViewRights = (state: { viewRights: RightsState }) =>
  state.viewRights;

export const { updateViewRights } = viewRightsSlice.actions;

export default viewRightsSlice.reducer;
