import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../modules/mwc-module/src/store/store";

interface SignIn {}

const signInSlice = createSlice({
  name: "signIn",
  initialState: {
    password: "",
    loading: false,
  },
  reducers: {
    login: (state, action: PayloadAction<string>) => {},
  },
});

export const { login } = signInSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.SignInSlice.password;

export default signInSlice.reducer;
