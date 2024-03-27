import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../modules/mwc-module/src/store/store";
import { useEffect } from "react";

export interface ILegal { legalAccepted: boolean, loading: false };

export const initialState: ILegal = {
    legalAccepted: false,
    loading: false
}

const LegalDisclaimerSlice = createSlice({
  name: "legal",
  initialState:initialState ,
  reducers: {
      acceptLegal: (state, action: PayloadAction<boolean>) => {
          state.legalAccepted = action.payload;
    },
    
    },
  extraReducers(builder) {
    
  },
});

export const { acceptLegal } = LegalDisclaimerSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectLegal = (state: RootState) => state.legal.legalAccepted;

export default LegalDisclaimerSlice.reducer;
