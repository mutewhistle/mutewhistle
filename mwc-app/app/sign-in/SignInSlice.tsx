import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../modules/mwc-module/src/store/store";

export interface ISignIn {
password: string
loading: false,
}

export const initialState: ISignIn = {
    password: "",
    loading: false
}


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
export const selectPassword = (state: RootState) => state.signIn.password

export default signInSlice.reducer;
