import * as R from 'ramda';
import { RESOURCES } from './resources';

export const getServerURL =
  () => {

    return `ws://${RESOURCES.HOST}:${RESOURCES.PORT}`;
  };

type Method =
  | `LIST`
  | `GET`;

type MessagePayload<P extends Record<string, string>> = {
  method: Method;
  url: string;
  params: P;
};

/**
 * If `HOST` or `PORT` is incorrect everything will break
 * In a production I would add validation
 * 
 * In my project I use the following to address this
 * - io-ts
 * - Reader & TaskEither Monads
 */
let ws: WebSocket | undefined;

const getSocket =
  (): WebSocket => {

    if (R.isNil(ws) || ws.readyState === ws.CLOSED || ws.readyState === ws.CLOSING) {

      ws = new WebSocket(getServerURL());
    }

    return ws;
  };

const waitForOpenSocket =
  (ws: WebSocket): Promise<void> => {
    return new Promise(
      (resolve) => {
        if (ws.readyState !== ws.OPEN) {

          ws.onopen = () => resolve();
        } else {

          resolve();
        }
      },
    );
  };

/**
 * A function which executed everytime there is a corresponding
 * message from the server
 */
type onData<T> = (data: T) => void;

/**
 * A function which executed everytime there is a corresponding
 * message from the server
 */
type onError = (error: Error) => void;

/**
 * A function which removes all corresponding listeners
 */
type Unsubscribe = () => void;

export const _connect =
  <P extends Record<string, string>>(payload: MessagePayload<P>) =>
    <D>(
      onData: onData<D>,
      onError: onError,
    ): Unsubscribe => {

      const ws = getSocket();

      /**
       * Waiting until WS becomes connected before we start to interact with it
       */
      waitForOpenSocket(ws)
        .then(
          () => {

            /**
             * We check here if `readyState` is still open
             * because it could be that the server quickly
             * closed the connection right after opening it
             */
            if (ws.readyState === ws.OPEN) {

              ws.send(JSON.stringify(payload));
            }
          },
        );

      const messageEventListener =
        (event: WebSocketEventMap[`message`]) => {

          /**
           * IO should be validated
           *
           * In my project I use: io-ts for this case
           */
          const response = JSON.parse(
            event.data,
            (_, value) => {

              /**
               * I intentionally use `undefined` over `null` everywhere for consistency
               * @see https://github.com/apollographql/apollo-client/issues/2412#issuecomment-755449680
               */
              if (value === null) {
                return undefined;
              } else {
                return value;
              }
            },
          );

          if (
            response.method !== payload.method ||
            response.url !== payload.url
          ) {

            return;
          }

          onData(response.body);
        };

      // Listening to messages
      ws.addEventListener(
        `message`,
        messageEventListener,
      );

      const errorEventListener =
        () => {

          onError(Error(`[WS] Unknown Error`));
        };

      ws.addEventListener(
        `error`,
        errorEventListener,
      );

      /**
       * Unsubscribe function
       */
      return () => {

        ws.removeEventListener(
          `message`,
          messageEventListener,
        );

        ws.removeEventListener(
          `error`,
          errorEventListener,
        );
      };
    };

/**
 * List
 */
export const list =
  (url: string) =>
    <P extends Record<string, string>>(params: P) => {

      const payload = {
        method: `LIST` as const,
        url,
        params,
      };

      // Configuring Listener
      return _connect(payload);
    };

/**
 * Read
 */
export const read =
  (url: string) =>
    <P extends Record<string, string>>(params: P) => {

      const payload = {
        method: `GET` as const,
        url,
        params,
      };

      // Configuring Listener
      return _connect(payload);
    };
