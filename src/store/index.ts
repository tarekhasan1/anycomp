// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import specialistReducer from './slices/specialistSlice';

export const store = configureStore({
  reducer: {
    specialist: specialistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;