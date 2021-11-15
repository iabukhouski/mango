import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { Product, ReadProduct } from './products.d';
import { readProduct, listProducts as listProductsDAL } from './dal';

export type ProductsState = {
  listProductsInProgress: boolean;
  listProductsError?: unknown;
  products?: Product[];

  readProductInProgress: boolean;
  readProductError?: unknown;
  product?: ReadProduct;
};

const initialState: ProductsState = {
  listProductsInProgress: false,
  listProductsError: undefined,
  products: undefined,

  readProductInProgress: false,
  readProductError: undefined,
  product: undefined,
};

export const productsSlice = createSlice(
  {
    name: `products`,
    initialState,
    reducers: {
      listProducts: (state) => {

        state.listProductsInProgress = true;
      },
      listProductsSuccess: (state, action) => {

        state.products = action.payload.products;
        state.listProductsInProgress = false;
      },
      listProductsFailure: (state, action) => {

        state.listProductsError = action.payload.error;
        state.listProductsInProgress = false;
      },
      productsWillUnmount: (state) => {

        state.products = undefined;
        state.listProductsError = undefined;
      },
      readProductSuccess: (state, action) => {

        state.readProductInProgress = false;
        state.product = action.payload.product;
      },
      readProductFailure: (state, action) => {

        state.readProductInProgress = false;
        state.readProductError = action.payload.error;
      },
      productWillUnmount: (state) => {

        state.product = undefined;
      },
    },
  },
);

export const {
  listProducts,
  listProductsFailure,
  listProductsSuccess,
  productsWillUnmount,

  readProductFailure,
  readProductSuccess,
  productWillUnmount,
} = productsSlice.actions;

/**********
 * THUNKS *
 **********/

/**
 * List Products
 */
export const listProductsThunk =
  () =>
    async (dispatch: Dispatch) => {

      try {

        dispatch(listProducts());

        const products = await listProductsDAL();

        dispatch(listProductsSuccess({ products }));
      } catch (error) {

        dispatch(listProductsFailure({ error }));
      }
    };

/**
 * Read Product
 */
export const readProductThunk =
  (productId: Product['id']) =>
    (dispatch: Dispatch) => {

      readProduct(productId)(
        (product: ReadProduct | undefined) => {

          dispatch(readProductSuccess({ product }));
        },
        (error) => {

          dispatch(readProductFailure({ error }));
        },
      );
    };

/*************
 * SELECTORS *
 *************/

export const selectListProductsInProgress = (state: RootState) => state.products.listProductsInProgress;
export const selectProducts = (state: RootState) => state.products.products;
export const selectListProductsError = (state: RootState) => state.products.listProductsError;

export const selectReadProductInProgress = (state: RootState) => state.products.readProductInProgress;
export const selectReadProductError = (state: RootState) => state.products.readProductError;
export const selectProduct = (state: RootState) => state.products.product;

export default productsSlice.reducer;
