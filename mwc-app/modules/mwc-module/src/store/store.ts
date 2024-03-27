import { Action, combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import SignInSlice from "../../../../app/sign-in/SignInSlice";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, createMigrate, persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from 'redux-logger'
import LegalDisclaimerSlice, { ILegal } from "../../../../app/(home)/LegalDisclaimerSlice";
import { migrations } from "../common/migrations";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";


//see link below for setup information
// https://blog.logrocket.com/persist-state-redux-persist-redux-toolkit-react/
const preloadedState: any = {}

const rootPersistConfig:any = {
  key: 'root',
  stateReconciler: autoMergeLevel2,
  storage: AsyncStorage,
  version: 2,
  // default is -1, increment as we make migrations
  safelist: ['settings'],
  migrate: createMigrate(migrations, {
    debug: true,
  }),
}

const appPersistConfig = {
  key: 'app',
  stateReconciler: autoMergeLevel2,
  storage: AsyncStorage,
  safelist: ['legalAccepted'],
}

const balancePersistConfig = {
  key: 'balance',
  stateReconciler: autoMergeLevel2,
  storage: AsyncStorage,
  safelist: ['data'],
}

const currencyPersistRatesConfig = {
  key: 'currencyRates',
  stateReconciler: autoMergeLevel2,
  storage: AsyncStorage,
  safelist: ['rates', 'lastUpdated'],
}

const rootReducer:any = combineReducers({ 
  signIn:SignInSlice,
  legal:persistReducer<RootState>(appPersistConfig,LegalDisclaimerSlice)
})


const persistedReducer: any = persistReducer<RootState, Action>(rootPersistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
   middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState,   
});



export const persistor = persistStore(store)

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
