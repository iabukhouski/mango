import { test, beforeEach, afterEach, expect } from '@jest/globals';
import { createConnection, getConnection } from 'typeorm';
import { listProducts, createProduct, readProduct, updateProduct, deleteProduct } from './data';

beforeEach(() => {
  return createConnection({
    type: `sqlite`,
    database: `:memory:`,
    dropSchema: true,
    entities: [`src/**/entity.ts`],
    synchronize: true,
    logging: false
  });
});

afterEach(() => {
  const connection = getConnection();
  return connection.close();
});

test(`'listProducts' should return all entries`, async () => {

  const partialProduct1 = {
    name: `Test Product 1`,
  };

  await createProduct(partialProduct1);

  const partialProduct2 = {
    name: `Test Product 2`,
  };

  await createProduct(partialProduct2);

  const products = await listProducts();

  expect(products).toHaveLength(2);
  expect(products[0].name).toEqual(partialProduct1.name);
  expect(products[1].name).toEqual(partialProduct2.name);
});

test(`'readProduct' should return an entity by id`, async () => {

  const partialProduct1 = {
    name: `Test Product 1`,
  };

  await createProduct(partialProduct1);

  const partialProduct2 = {
    name: `Test Product 2`,
  };

  const product2 = await createProduct(partialProduct2);

  const product = await readProduct(product2.id);

  expect(product.id).toEqual(product2.id);
});

test(`'updateProduct' should properly update a product`, async () => {

  const partialProduct = {
    name: `Test Product 1`,
  };

  const product = await createProduct(partialProduct);

  const updatedPartialProduct = {
    name: `Updated Test Product 1`,
  };

  await updateProduct(product.id)(updatedPartialProduct);

  const updatedProduct = await readProduct(product.id);

  expect(updatedProduct.name).toEqual(updatedPartialProduct.name);
});

test(`'deleteProduct' should successfully delete a product`, async () => {

  const partialProduct = {
    name: `Test Product 1`,
  };

  const product = await createProduct(partialProduct);

  await deleteProduct(product.id);

  const deletedProduct = await readProduct(product.id);

  expect(deletedProduct).toEqual(undefined);
});
