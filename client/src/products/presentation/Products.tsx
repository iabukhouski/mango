import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as R from 'ramda';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  listProductsThunk,
  productsWillUnmount,
  selectListProductsError,
  selectListProductsInProgress,
  selectProducts,
} from '../slice'

/**
 * Products
 */
export const Products =
  () => {

    const listProductsInProgress = useAppSelector(selectListProductsInProgress);
    const listProductsError = useAppSelector(selectListProductsError);
    const products = useAppSelector(selectProducts);
    const dispatch = useAppDispatch();

    useEffect(
      () => {

        dispatch(listProductsThunk());

        return () => {
          dispatch(productsWillUnmount());
        };
      },
      [
        dispatch,
      ],
    );

    if (!R.isNil(listProductsError)) {

      return (
        <Typography
          variant='body1'
        >
          Unable to load products
        </Typography>
      );
    }

    if (listProductsInProgress || R.isNil(products)) {

      return (
        <CircularProgress />
      );
    }

    if (products.length === 0) {

      return (
        <Typography
          variant='body1'
        >
          No Products
        </Typography>
      );
    }

    return (
      <List>
        {
          products.map(
            (product) => {

              return (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                >
                  <ListItem>
                    <ListItemText
                      primary={product.name}
                    />
                  </ListItem >
                </Link>
              );
            },
          )
        }
      </List>
    );
  };
