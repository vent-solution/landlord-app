import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SettingsModel } from "./SettingsModel";
import { fetchData } from "../../global/api";

interface UpdateModel {
  id: number | undefined;
  changes: SettingsModel;
}
interface InitialStateModel {
  settings: SettingsModel[];
  status: "loading" | "idle" | "failed" | "succeeded";
  error: string;
}

const initialState: InitialStateModel = {
  settings: [
    {
      subscriptionFee: 0,
      brokerFee: 0,
      serviceFeeFreeRoom: 0,
      serviceFeeOccupiedRoom: 0,
      minimumBidFee: 0,
      otherStaffServiceFee: 0,
      preferedCurrency: "usd",
    },
  ],
  status: "idle",
  error: "",
};

export const fetchAdminFinancialSettings = createAsyncThunk(
  "fetchAdminFinancialSettings",
  async () => {
    const results = await fetchData("/fetch-admin-financial-settings");
    if (results.data.status && results.data.status !== "OK") {
      return initialState;
    }

    return results.data;
  }
);

const SettingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateSettings: {
      reducer(state, action: PayloadAction<UpdateModel>) {
        const { id, changes } = action.payload;
        const settingsIndex = state.settings.findIndex(
          (setting) => (setting.id = id)
        );

        if (settingsIndex >= 0) {
          state.settings[settingsIndex] = {
            ...state.settings[settingsIndex],
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
      .addCase(fetchAdminFinancialSettings.pending, (state) => {
        state.status = "loading";
        state.error = "null";
      })
      .addCase(
        fetchAdminFinancialSettings.fulfilled,
        (state, action: PayloadAction<SettingsModel[]>) => {
          state.status = "succeeded";
          state.error = "null";
          state.settings =
            action.payload.length > 0 ? action.payload : initialState.settings;
        }
      )
      .addCase(fetchAdminFinancialSettings.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.statusMessage;
      });
  },
});

export const getSettings = (state: { settings: InitialStateModel }) =>
  state.settings;

export const { updateSettings } = SettingsSlice.actions;
export default SettingsSlice.reducer;
