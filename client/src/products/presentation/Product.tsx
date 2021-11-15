import { useState, useEffect } from 'react';
import { useRouteMatch } from 'react-router';
import * as R from 'ramda';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { Product as ProductType, ReadProduct } from '../products.d';
import { Reviews, AddReviewModal } from '../../reviews';
import {
  productWillUnmount,
  readProductThunk,
  selectProduct,
  selectReadProductError,
  selectReadProductInProgress,
} from '../slice';

/**
 * Product Avg Score
 */
type ProductAvgScoreProps = {
  product: ReadProduct;
};

const ProductAvgScore =
  (
    {
      product,
    }: ProductAvgScoreProps,
  ) => {

    if (R.isNil(product.avgScore)) {

      return null;
    }

    return (
      <>
        <Typography variant='body1' fontWeight='bold'>{product.avgScore}</Typography>
        <Rating precision={0.5} value={product.avgScore} readOnly />
      </>
    );
  };

/**
 * Product
 */
const Main = styled(Container)`
  padding-top: 24px;
  padding-bottom: 24px;
`;

const ProductInfo = styled(Box)`
  display: flex;
  grid-gap: 10px;
  align-items: center;
`;

type ProductParams = {
  productId: ProductType['id'];
};

export const Product =
  () => {

    const match = useRouteMatch<ProductParams>();
    const dispatch = useAppDispatch();
    const readProductInProgress = useAppSelector(selectReadProductInProgress);
    const readProductError = useAppSelector(selectReadProductError);
    const product = useAppSelector(selectProduct);

    const productId = match.params.productId;

    useEffect(
      () => {

        dispatch(readProductThunk(productId));

        return () => {

          dispatch(productWillUnmount());
        };
      },
      [
        dispatch,
        productId,
      ],
    );

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    if (!R.isNil(readProductError)) {

      return (
        <Typography
          variant='body1'
        >
          Unable to load product
        </Typography>
      );
    }

    if (readProductInProgress || R.isNil(product)) {

      return (
        <CircularProgress />
      );
    }

    return (
      <>
        <Main>
          <Stack
            spacing={2}
          >

            <Box>
              <Typography variant='h1'>{product.name}</Typography>
              <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'
                spacing={2}
              >
                <ProductInfo>
                  <ProductAvgScore
                    product={product}
                  />
                </ProductInfo>
                <Button variant='contained' onClick={handleOpen} size='small'>Add Review</Button>
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography variant='h2'>Reviews</Typography>
              <Reviews
                productId={productId}
              />
            </Box>

          </Stack>
        </Main>
        <AddReviewModal
          productId={productId}
          open={open}
          onClose={handleClose}
        />
      </>
    );
  };
