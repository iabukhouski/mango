import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { screen } from '@testing-library/react';
import { render } from '../../utils/test';
import { Products } from './Products';

export const handlers = [
  rest.get('/api/products', (_, response, ctx) => {

    const products = [
      {
        id: `product1`,
        name: `Product One`,
      },
    ];

    return response(ctx.json(products), ctx.delay(150));
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

test(`Should load and display all products`, async () => {

  render(<Products />);

  expect(await screen.findByText(/Product One/i)).toBeInTheDocument();
});
