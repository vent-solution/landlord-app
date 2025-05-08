import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ActionModel {
  userAction: () => Promise<void>;
}
const initialState: ActionModel = {
  userAction: async () => {},
};

const actionSlice = createSlice({
  name: "action",
  initialState,
  reducers: {
    setUserAction(state, action: PayloadAction<ActionModel>) {
      return (state = action.payload);
    },
  },
});

export const { setUserAction } = actionSlice.actions;
export const getAction = (state: { action: ActionModel }) => state.action;
export default actionSlice.reducer;
