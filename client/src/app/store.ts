import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { productsReducer } from '../products';
import { reviewsReducer } from '../reviews';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    reviews: reviewsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
