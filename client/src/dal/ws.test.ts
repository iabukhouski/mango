import { getServerURL, _connect } from './ws';
import { Server } from 'mock-socket';

const fakeURL = getServerURL();

test(`Should connect to WSS`, (done) => {

  const wss = new Server(fakeURL);

  const payload = {
    method: `GET` as const,
    url: `/hello_world`,
    params: {
      hello: `world`,
    },
  };
  const onData = jest.fn();
  const onError = jest.fn();

  wss.on(`connection`, () => {

    expect(onData).toHaveBeenCalledTimes(0);
    expect(onError).toHaveBeenCalledTimes(0);

    wss.close();

    done();
  });


  _connect(payload)(onData, onError);
});

test(`Should send passed payload`, () => {

  const wss = new Server(fakeURL);

  const payload = {
    method: `GET` as const,
    url: `/hello_world`,
    params: {
      hello: `world`,
    },
  };
  const onData = jest.fn();
  const onError = jest.fn();

  wss.on(`connection`, (ws) => {

    ws.on(`message`, (stringifiedPayload) => {

      const parsedPayload = JSON.parse(String(stringifiedPayload));

      expect(parsedPayload).toStrictEqual(payload)
    });
  });

  _connect(payload)(onData, onError);

  expect(onData).toHaveBeenCalledTimes(0);
  expect(onError).toHaveBeenCalledTimes(0);

  wss.close();
});

test(`Should recieve passed payload`, (done) => {

  const wss = new Server(fakeURL);

  const requestPayload = {
    method: `GET` as const,
    url: `/hello_world`,
    params: {
      hello: `world`,
    },
  };

  const responseBody = [
    {
      id: `product1`,
      name: `Product One`,
    },
  ];

  const responsePayload = {
    method: `GET` as const,
    url: `/hello_world`,
    params: {
      hello: `world`,
    },
    body: responseBody,
  };

  const onData = (payload: typeof responseBody) => {

    expect(payload).toStrictEqual(responseBody);
    expect(onError).toHaveBeenCalledTimes(0);

    wss.close();

    done();
  };
  const onError = jest.fn();

  wss.on(`connection`, (ws) => {

    ws.on(`message`, () => {

      ws.send(JSON.stringify(responsePayload));
    });
  });

  _connect(requestPayload)(onData, onError);
});

test(`Should not recieve payload intended for other listeners`, (done) => {

  const wss = new Server(fakeURL);

  const requestPayload1 = {
    method: `GET` as const,
    url: `/hello_world`,
    params: {
      hello: `world`,
    },
  };

  const requestPayload2 = {
    method: `LIST` as const,
    url: `/hello_world`,
    params: {
      hello: `world`,
    },
  };

  const responseBody = [
    {
      id: `product1`,
      name: `Product One`,
    },
  ];

  const responsePayload = {
    method: `LIST` as const,
    url: `/hello_world`,
    params: {
      hello: `world`,
    },
    body: responseBody,
  };

  const onError1 = jest.fn();
  const onData1 = jest.fn();
  const onError2 = jest.fn();
  const onData2 = (payload: typeof responseBody) => {

    expect(payload).toStrictEqual(responseBody);
    expect(onData1).toBeCalledTimes(0);
    expect(onError1).toBeCalledTimes(0);
    expect(onError2).toBeCalledTimes(0);

    wss.close();

    done();
  };

  wss.on(`connection`, (ws) => {

    ws.on(`message`, () => {

      ws.send(JSON.stringify(responsePayload));
    });
  });

  _connect(requestPayload1)(onData1, onError1);
  _connect(requestPayload2)(onData2, onError2);
});

test(`Should properly close connection`, async () => {

  const wss = new Server(fakeURL);

  const requestPayload = {
    method: `GET` as const,
    url: `/hello_world`,
    params: {
      hello: `world`,
    },
  };

  const onData = jest.fn();
  const onError = jest.fn();

  wss.on(`connection`, (ws) => {

    ws.on(`message`, () => {

      const responsePayload = {
        method: `GET` as const,
        url: `/hello_world`,
        params: {
          hello: `world`,
        },
        body: [
          {
            id: `product1`,
            name: `Product One`,
          }
        ],
      };

      ws.send(JSON.stringify(responsePayload));
    });
  });

  const unsubscribe = _connect(requestPayload)(onData, onError);

  unsubscribe();

  expect(onData).toBeCalledTimes(0);
  expect(onError).toBeCalledTimes(0);

  wss.close();
});

test(`'onError' should be called in case of an error`, () => {

  const wss = new Server(fakeURL);

  const requestPayload = {
    method: `GET` as const,
    url: `/hello_world`,
    params: {
      hello: `world`,
    },
  };

  const onData = jest.fn();
  const onError = jest.fn();

  _connect(requestPayload)(onData, onError);

  wss.simulate(`error`);

  expect(onData).toBeCalledTimes(0);
  expect(onError).toBeCalledTimes(1);

  wss.close();
});
