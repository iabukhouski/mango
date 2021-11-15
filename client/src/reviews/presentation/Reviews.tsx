import { useEffect } from 'react';
import * as R from 'ramda';
import Rating from '@mui/material/Rating';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { Review } from '../reviews.d';
import {
  listReviewsThunk,
  reviewsWillUnmount,
  selectListReviewsError,
  selectListReviewsInProgress,
  selectReviews,
} from '../slice'

const ReviewItem = styled(ListItem)`
  grid-gap: 10px;
`;

type ReviewsProps = {
  productId: Review['productId'];
};

export const Reviews =
  (
    {
      productId,
    }: ReviewsProps,
  ) => {
    const dispatch = useAppDispatch();
    const listReviewsInProgress = useAppSelector(selectListReviewsInProgress);
    const listReviewsError = useAppSelector(selectListReviewsError);
    const reviews = useAppSelector(selectReviews);

    useEffect(
      () => {

        dispatch(listReviewsThunk(productId));

        return () => {

          dispatch(reviewsWillUnmount());
        };
      },
      [
        dispatch,
        productId,
      ],
    );

    if (!R.isNil(listReviewsError)) {

      return (
        <Typography
          variant='body1'
        >
          Unable to load reviews
        </Typography>
      );
    }

    if (listReviewsInProgress || R.isNil(reviews)) {
      return (
        <CircularProgress />
      );
    }

    if (reviews.length === 0) {

      return (
        <Typography
          variant='body1'
        >
          No Reviews
        </Typography>
      );
    }

    return (
      <List>
        {
          reviews.map(
            (review) => {

              return (
                <ReviewItem
                  key={review.id}
                >
                  <Rating
                    precision={0.5}
                    value={review.score}
                    readOnly
                  />
                  <Typography
                    variant='body1'
                    fontWeight='bold'
                  >
                    {review.score}
                  </Typography>
                  <Typography
                    variant='body1'
                  >
                    {review.description}
                  </Typography>
                </ReviewItem>
              );
            },
          )
        }
      </List>
    );
  };
