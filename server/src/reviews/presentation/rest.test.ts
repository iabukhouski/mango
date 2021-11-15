import { test, beforeAll, afterAll, expect } from '@jest/globals';
import supertest from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import { server } from '../../servers';

beforeAll(() => {
  return createConnection({
    type: `sqlite`,
    database: `:memory:`,
    dropSchema: true,
    entities: [`src/**/entity.ts`],
    synchronize: true,
    logging: false
  });
});

afterAll(() => {
  const connection = getConnection();
  return connection.close();
});

test(`Should list all reviews`, async () => {
  const res = await supertest(server)
    .get(`/api/products/product1/reviews`)
    .send();

  expect(res.statusCode).toEqual(200);
  expect(res.body).toEqual([]);
});

test(`Should create a review`, async () => {

  const partialProduct = {
    name: `Test Product`,
  };

  const partialReview = {
    score: 0.5,
    description: `My Review 1`,
  };

  const createProductResponse = await supertest(server)
    .post(`/api/products`)
    .send(partialProduct);

  const createReviewResponse = await supertest(server)
    .post(`/api/products/${createProductResponse.body.id}/reviews`)
    .send(partialReview);

  expect(createReviewResponse.statusCode).toEqual(201);
  expect(createReviewResponse.body.score).toEqual(partialReview.score);
  expect(createReviewResponse.body.description).toEqual(partialReview.description);
});

test('Should read a review', async () => {
  const partialProduct = {
    name: `Test Product`,
  };

  const partialReview = {
    score: 0.5,
    description: `My Review 1`,
  };

  const createProductResponse = await supertest(server)
    .post(`/api/products`)
    .send(partialProduct);

  const createReviewResponse = await supertest(server)
    .post(`/api/products/${createProductResponse.body.id}/reviews`)
    .send(partialReview);

  const readReviewResponse = await supertest(server)
    .get(`/api/products/${createProductResponse.body.id}/reviews/${createReviewResponse.body.id}`)
    .send();

  expect(readReviewResponse.statusCode).toEqual(200);
  expect(readReviewResponse.body.score).toEqual(partialReview.score);
  expect(readReviewResponse.body.description).toEqual(partialReview.description);
});

test('Should delete a review', async () => {
  const partialProduct = {
    name: `Test Product`,
  };

  const partialReview = {
    score: 0.5,
    description: `My Review 1`,
  };

  const createProductResponse = await supertest(server)
    .post(`/api/products`)
    .send(partialProduct);

  const createReviewResponse = await supertest(server)
    .post(`/api/products/${createProductResponse.body.id}/reviews`)
    .send(partialReview);

  const deleteReviewResponse = await supertest(server)
    .delete(`/api/products/${createProductResponse.body.id}/reviews/${createReviewResponse.body.id}`)
    .send();

  expect(deleteReviewResponse.statusCode).toEqual(204);
});
