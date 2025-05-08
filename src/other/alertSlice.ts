// usersSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AlertModel } from "../modules/users/models/alertModel";

// initial users state
const initialState: AlertModel = {
  message: "",
  type: "",
  status: false,
};

// create users slice
const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    setAlert(state, action: PayloadAction<AlertModel>) {
      return action.payload;
    },
  },
});

export const getAlert = (state: { alert: AlertModel }) => state.alert;

export const { setAlert } = alertSlice.actions;

export default alertSlice.reducer;
