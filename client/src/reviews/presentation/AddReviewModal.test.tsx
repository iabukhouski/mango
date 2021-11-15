import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { fireEvent, screen, } from '@testing-library/react';
import { render } from '../../utils/test';
import { required, AddReviewModal } from './AddReviewModal';

const server = setupServer();

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

test(`Should create a review`, (done) => {

  const productId = `product1`;
  const reviewDescription = `Review Description`;
  const onClose = jest.fn();

  server.use(
    rest.post(
      `/api/products/${productId}/reviews`,
      (req, res, ctx) => {

        expect(req.body).toStrictEqual({ score: 0.5, description: reviewDescription })
        expect(onClose).toHaveBeenCalledTimes(1);

        done();

        return res(ctx.status(201));
      }),
  );

  render(
    <AddReviewModal
      productId={productId}
      open={true}
      onClose={onClose}
    />
  );

  /**
   * Rating
   */
  const inputNode = screen.getByTestId(`Rating`);
  const checkbox = inputNode.childNodes[0].childNodes[1];

  fireEvent.click(checkbox);

  /**
   * Description
   */
  const textFieldNode = screen.getByTestId(`Description`);
  const textarea = textFieldNode.childNodes[0].childNodes[0];

  fireEvent.change(textarea, { target: { value: reviewDescription } });

  /**
   * Submitting Form
   */
  fireEvent.click(screen.getByText(`Submit Review`));
});

test(`'required' should return 'undefined' if value is provided`, () => {

  const error = required(1);

  expect(error).toEqual(undefined);
});

test(`'required' should return error message if value is not provided`, () => {

  const error = required(undefined);

  expect(error).toEqual(`Required`);
});
