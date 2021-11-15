import { screen } from '@testing-library/react';
import { Server } from 'mock-socket';
import { render } from '../../utils/test';
import { getServerURL } from '../../dal';
import { Review } from '../reviews.d';
import { Reviews } from './Reviews';

const serverURL = getServerURL();

test(`Should load and display product's reviews`, async () => {

  const productId = `product1` as Review['productId'];

  const wss = new Server(serverURL);

  wss.on(`connection`, ws => {

    ws.on(`message`, () => {

      const reviews = [
        {
          id: `review1`,
          productId,
          score: 1,
          description: `Review One`,
          createdAt: `2021-09-28T17:21:43.943Z`,
          updatedAt: `2021-09-28T17:21:43.943Z`,
        },
      ];

      const payload = {
        method: `LIST`,
        url: `reviews`,
        params: {
          productId,
        },
        body: reviews,
      };

      ws.send(JSON.stringify(payload));
    });
  });

  render(<Reviews productId={productId} />);

  expect(await screen.findByText(/Review One/i)).toBeInTheDocument();

  wss.stop();
});
