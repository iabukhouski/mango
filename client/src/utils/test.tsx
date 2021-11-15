import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import productsReducer from '../products/slice';
import reviewsReducer from '../reviews/slice';

/**
 * A wrapper component used to minimize boilerplate in tests.
 * Includes backed-in `Redux Store` and `React Router`
 * 
 * @param Component - A component to be rendered
 * @param initialEntries - used for configuring `MemoryRouter`
 */
export const render =
  (
    Component: React.ReactElement,
    initialEntries?: [string],
  ) => {

    const store = configureStore(
      {
        reducer: {
          products: productsReducer,
          reviews: reviewsReducer,
        },
        preloadedState: {
          products: {
            readProductInProgress: false,
            listProductsInProgress: false,
          },
          reviews: {
            createReviewInProgress: false,
            listReviewsInProgress: false,
          },
        },
      },
    );

    const Wrapper: React.FC =
      ({ children }) => {
        return (
          <Provider
            store={store}
          >
            <MemoryRouter
              initialEntries={initialEntries}
            >
              {children}
            </MemoryRouter>
          </Provider>
        );
      };

    return rtlRender(Component, { wrapper: Wrapper });
  };
