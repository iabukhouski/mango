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

test('Should list all products', async () => {
  const res = await supertest(server)
    .get('/api/products')
    .send();

  expect(res.statusCode).toEqual(200);
});

test('Should create a product', async () => {
  const partialProduct = {
    name: `Test Product`,
  };

  const res = await supertest(server)
    .post('/api/products')
    .send(partialProduct);

  expect(res.statusCode).toEqual(201);
  expect(res.body.name).toEqual(partialProduct.name);
});

test('Should read a product', async () => {
  const partialProduct = {
    name: `Test Product`,
  };

  const res1 = await supertest(server)
    .post('/api/products')
    .send(partialProduct);

  const res2 = await supertest(server)
    .get(`/api/products/${res1.body.id}`)
    .send(partialProduct);

  expect(res2.statusCode).toEqual(200);
  expect(res2.body.name).toEqual(partialProduct.name);
});

test('Should delete a product', async () => {
  const partialProduct = {
    name: `Test Product`,
  };

  const res1 = await supertest(server)
    .post('/api/products')
    .send(partialProduct);

  const res2 = await supertest(server)
    .delete(`/api/products/${res1.body.id}`)
    .send(partialProduct);

  expect(res2.statusCode).toEqual(204);

  const res3 = await supertest(server)
    .get(`/api/products/${res1.body.id}`)
    .send(partialProduct);

  expect(res3.statusCode).toEqual(404);
});
