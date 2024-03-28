import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { router } from "expo-router";
import { initWallet } from "../../modules/mwc-module";

export interface IPassword {
  password: string;
  loading: false;
}

export const initialState: IPassword = {
  password: "",
  loading: false,
};

const NewPasswordSlice = createSlice({
  name: "password",
  initialState: initialState,
  reducers: {
    callInitWallet: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
      initWallet(state.password);
    },
  },
  extraReducers(builder) {},
});

export const { callInitWallet } = NewPasswordSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectLegal = (state: IPassword) => state.password;

export default NewPasswordSlice.reducer;
