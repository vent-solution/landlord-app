// ConfirmSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConfirmModel } from "../modules/users/models/confirmModel";

interface ConfirmState {
  message: string;
  status: boolean;
}

const initialState: ConfirmState = {
  message: "",
  status: false,
};

const confirmSlice = createSlice({
  name: "confirm",
  initialState,
  reducers: {
    setConfirm(state, action: PayloadAction<ConfirmModel>) {
      return action.payload;
    },
  },
});

export const { setConfirm } = confirmSlice.actions;
export const getConfirm = (state: { confirm: ConfirmState }) => state.confirm;
export default confirmSlice.reducer;
