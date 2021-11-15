import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { listReviewsByProductId, createReview } from './dal';
import { Review, PartialReview } from './reviews.d';

export type ReviewsState = {
  createReviewInProgress: boolean;

  listReviewsInProgress: boolean;
  listReviewsError?: unknown;
  reviews?: Review[];
};

const initialState: ReviewsState = {
  createReviewInProgress: false,

  listReviewsInProgress: false,
  listReviewsError: undefined,
  reviews: undefined,
};

type CreateReviewThunkPayload = {
  productId: Review['productId'];
  partialReview: PartialReview;
};

export const createReviewThunk = createAsyncThunk(
  `reviews/createReview`,
  (
    {
      productId,
      partialReview,
    }: CreateReviewThunkPayload,
  ) => {

    return createReview(productId)(partialReview);
  },
);

export const reviewsSlice = createSlice({
  name: `reviews`,
  initialState,
  reducers: {
    listReviews: (state) => {

      state.reviews = undefined;
      state.listReviewsInProgress = true;
    },
    listReviewsSuccess: (state, action) => {

      state.reviews = action.payload.reviews;
      state.listReviewsInProgress = false;
    },
    listReviewsFailure: (state, action) => {

      state.listReviewsError = action.payload.error;
      state.listReviewsInProgress = false;
    },
    reviewsWillUnmount: (state) => {

      state.reviews = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReviewThunk.pending, (state) => {
        state.createReviewInProgress = true;
      })
      .addCase(createReviewThunk.fulfilled, (state) => {
        state.createReviewInProgress = false;
      })
      .addCase(createReviewThunk.rejected, (state) => {
        state.createReviewInProgress = false;
      });
  },
});

export const {
  listReviews,
  listReviewsSuccess,
  listReviewsFailure,
  reviewsWillUnmount,
} = reviewsSlice.actions;

/**********
 * THUNKS *
 **********/

/**
 * List Reviews
 */
export const listReviewsThunk =
  (productId: Review['productId']) =>
    (dispatch: Dispatch) => {

      dispatch(listReviews());

      listReviewsByProductId(productId)(
        (reviews: Review[]) => {

          dispatch(listReviewsSuccess({ reviews }));
        },
        (error) => {

          dispatch(listReviewsFailure({ error }));
        },
      );
    };

/*************
 * SELECTORS *
 *************/

export const selectListReviewsInProgress = (state: RootState) => state.reviews.listReviewsInProgress;
export const selectListReviewsError = (state: RootState) => state.reviews.listReviewsError;
export const selectReviews = (state: RootState) => state.reviews.reviews;

export default reviewsSlice.reducer;
