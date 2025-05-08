import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SubscriptionModel } from "./SubscriptionModel";
import { fetchData } from "../../global/api";
import axios from "axios";

interface UpdateModel {
  id: string | undefined;
  changes: SubscriptionModel;
}
interface StateModel {
  subscriptions: SubscriptionModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idle" | "succeeded" | "failed" | "loading";
  error: string | null;
}

const initialState: StateModel = {
  subscriptions: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

export const fetchSubscriptions = createAsyncThunk(
  "fetchSubscription",
  async ({
    userId,
    page,
    size,
  }: {
    userId: number[];
    page: number;
    size: number;
  }) => {
    try {
      const result = await fetchData(
        `/fetch-landlord-user-subscription/${userId}/${page}/${size}`
      );
      if (result.data.status && result.data.status !== "OK") {
        return initialState;
      }
      return result.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH SUBSCRIPTION CANCELLED ", error.message);
      }
    }
  }
);

const SubscriptionSlice = createSlice({
  name: "subscriptions",
  initialState,

  reducers: {
    // reset subscription
    resetSubscription: {
      reducer(state, action: PayloadAction<StateModel>) {
        state.subscriptions = action.payload.subscriptions;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      },
      prepare(subscriptions: StateModel) {
        return { payload: subscriptions };
      },
    },

    // update subscription
    updateSubscription: {
      reducer(state, action: PayloadAction<UpdateModel>) {
        const { id, changes } = action.payload;
        const subscriptionIndex = state.subscriptions.findIndex(
          (subs) => Number(subs.subscriptionId) === Number(id)
        );
        if (subscriptionIndex >= 0) {
          state.subscriptions[subscriptionIndex] = {
            ...state.subscriptions[subscriptionIndex],
            ...changes,
          };
        }
      },
      prepare(changes: UpdateModel) {
        return { payload: changes };
      },
    },

    deleteSubscriptionByUser: {
      reducer(state, action: PayloadAction<string | undefined>) {
        state.subscriptions = state.subscriptions.filter(
          (subscription) =>
            Number(subscription.user?.userId) !== Number(action.payload)
        );
      },
      prepare(subscriptionId: string | undefined) {
        return { payload: subscriptionId };
      },
    },
  },

  // extra reducers
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchSubscriptions.fulfilled,
        (state, action: PayloadAction<StateModel>) => {
          state.subscriptions = action.payload.subscriptions;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchSubscriptions.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getSubscription = (state: { subscriptions: StateModel }) =>
  state.subscriptions;

export const {
  resetSubscription,
  updateSubscription,
  deleteSubscriptionByUser,
} = SubscriptionSlice.actions;

export default SubscriptionSlice.reducer;
