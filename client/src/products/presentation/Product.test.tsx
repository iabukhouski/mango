import { screen } from '@testing-library/react';
import { Route } from 'react-router-dom';
import { Server } from 'mock-socket';
import { render } from '../../utils/test';
import { getServerURL } from '../../dal';
import { Product } from './Product';

const serverURL = getServerURL();

test(`Should load and display the 'product'`, async () => {

  const wss = new Server(serverURL);

  wss.on(`connection`, ws => {

    ws.on(`message`, () => {

      const product = {
        id: `product1`,
        name: `Product One`,
      };

      const payload = {
        method: `GET`,
        url: `products`,
        params: {
          productId: `product1`,
        },
        body: product,
      };

      ws.send(JSON.stringify(payload));
    });
  });

  render(
    <Route path='/products/:productId' component={Product} />,
    [`/products/product1`],
  );

  expect(await screen.findByText(/Product One/i)).toBeInTheDocument();

  wss.stop();
});
