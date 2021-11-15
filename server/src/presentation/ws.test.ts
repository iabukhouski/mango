import { test, expect } from '@jest/globals';
import { findInterestedSubscribers, createSubscriberMeta } from './ws';

test(`Should return an empty array if no interested subscribers found`, () => {

  const subscribers = new Map();
  const messagePayload = {
    method: `GET` as const,
    url: `/products`,
    params: {
      productId: `product1`,
    },
  };

  const interestedSubscribers = findInterestedSubscribers(messagePayload)(subscribers)

  expect(interestedSubscribers).toHaveLength(0);
});

test(`Should return only subscibers which are interested in the processed message`, () => {

  const ws1 = {};
  const ws2 = {};
  const subscribers = new Map();

  const messagePayload1 = {
    method: `GET` as const,
    url: `/products`,
    params: {
      productId: `product1`,
    },
  };

  const messagePayload2 = {
    method: `GET`,
    url: `/products`,
    params: {
      productId: `product1`,
    },
  };

  subscribers.set(
    ws1,
    {
      requests: [messagePayload1, messagePayload2],
      isAlive: true,
    },
  );

  subscribers.set(
    ws2,
    {
      requests: [messagePayload2],
      isAlive: true,
    },
  );

  const interestedSubscribers = findInterestedSubscribers(messagePayload1)(subscribers)

  expect(interestedSubscribers).toHaveLength(2);
});

test(`'newSubscriberMeta' should include 'messagePayload'`, () => {

  const messagePayload1 = {
    method: `GET` as const,
    url: `/products`,
    params: {
      productId: `product1`,
    },
  };

  const newSubscriberMeta = createSubscriberMeta(messagePayload1)();

  expect(newSubscriberMeta.requests.size).toEqual(1);
});

test(`'newSubscriberMeta' should include 'currentSubscriberMeta'`, () => {

  const messagePayload1 = {
    method: `GET` as const,
    url: `/products`,
    params: {
      productId: `product1`,
    },
  };

  const messagePayload2 = {
    method: `GET` as const,
    url: `/products`,
    params: {
      productId: `product1`,
    },
  };

  const subscriberMeta = {
    requests: new Set([messagePayload1]),
    isAlive: true,
  };

  const newSubscriberMeta = createSubscriberMeta(messagePayload2)(subscriberMeta);

  expect(newSubscriberMeta.requests.size).toEqual(2);
});
