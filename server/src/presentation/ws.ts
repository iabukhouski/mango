import { WebSocket } from 'ws';
import * as R from 'ramda';
import { serialize } from 'class-transformer';
import { JSON } from '../index.d';

type Method =
  | `LIST`
  | `GET`;

/**
 * Identify what kind and for which resource recieve notifications
 */
type MessagePayload = {
  method: Method;

  /**
   * @example `/products`
   */
  url: string;

  /**
   * @example { "productId": "product1" }
   */
  params: Record<string, string>;
};

type SubscriberMeta = {

  /**
   * A set of all active requests recieved from a particular subscriber
   */
  requests: Set<MessagePayload>;

  /**
   * Used to verify if the connection is still alive
   */
  isAlive: boolean;
};

const subscribers = new Map<WebSocket, SubscriberMeta>();

/**
 * Send
 */
const send =
  (messagePayload: MessagePayload) =>
    <T>(body: T) =>
      (ws: WebSocket): Promise<void> => {

        return new Promise(
          (resolve, reject) => {

            const payload = {
              ...messagePayload,
              body,
            };

            ws.send(
              serialize(payload),
              (error) => {

                if (!R.isNil(error)) {
                  console.log(`[WS] Unable to send`, error);

                  reject(error);
                } else {
                  resolve();
                }
              },
            );
          },
        );
      };

/**
 * Filtering out subscibers who are interested
 * in the broadcasted event
 */
export const findInterestedSubscribers =
  (messagePayload: MessagePayload) =>
    (subscribers: Map<WebSocket, SubscriberMeta>) => {

      return R.filter(
        ([_, subscriberMeta]: [WebSocket, SubscriberMeta]) => {

          const requests = [...subscriberMeta.requests.values()];

          return R.pipe(
            R.find(
              R.equals(
                messagePayload,
              ),
            ),
            R.isNil,
            R.not,
          )(requests);
        }
      )([...subscribers.entries()]);
    }

/**
 * Broadcast
 */
export const broadcast =
  (messagePayload: MessagePayload) =>
    async <T>(body: T): Promise<void> => {

      const interestedSubscribers = findInterestedSubscribers(messagePayload)(subscribers);

      /**
       * Broadcasting
       */
      const promises = R.pipe(
        R.map(
          ([ws]) => {

            return ws;
          },
        ),
        R.map(send(messagePayload)(body)),
      )(interestedSubscribers);

      await Promise.all(promises);
    }

export const createSubscriberMeta =
  (messagePayload: MessagePayload) =>
    (subscriberMeta?: SubscriberMeta) => {

      const preparedRequests =
        R.isNil(subscriberMeta)
          ? new Set([messagePayload])
          : new Set([...subscriberMeta.requests.values(), messagePayload]);

      return {
        requests: preparedRequests,
        isAlive: true,
      };
    };

/**
 * WebSockets Server
 */
import { WebSocketServer, ServerOptions } from 'ws';

export const configureWebSocketsServer =
  (options: ServerOptions) =>
    (onConnection: (data: JSON) => void) =>
      () => {

        const wss = new WebSocketServer(options);

        wss.on(
          `connection`,
          (ws) => {

            console.log(`[WS] Connection has been opened`);

            ws.on(
              `close`,
              () => {

                console.log(`[WS] Connection has been closed`);

                subscribers.delete(ws);
              },
            );

            ws.on(
              `message`,
              (message) => {

                try {

                  const parsedMessage = JSON.parse(String(message));

                  const subscriberMeta = subscribers.get(ws);

                  const newSubscriberMeta = createSubscriberMeta(parsedMessage)(subscriberMeta);

                  subscribers.set(ws, newSubscriberMeta);

                  onConnection(parsedMessage);
                } catch (error) {

                  ws.terminate();
                }
              },
            );

            /**
             * The client confirms that the connection is still alive
             */
            ws.on(
              `pong`,
              () => {

                const subscriberMeta = subscribers.get(ws);

                if (R.isNil(subscriberMeta)) {

                  return;
                }

                const preparedSubscriberMeta = {
                  ...subscriberMeta,
                  isAlive: true,
                };

                subscribers.set(ws, preparedSubscriberMeta);
              },
            );
          },
        );

        /**
         * Checks every so often if the connection is still alive
         */
        const pingInterval = setInterval(
          () => {
            wss.clients.forEach(
              (ws) => {

                const subscriberMeta = subscribers.get(ws);

                /**
                 * Terminating stale connections
                 */
                if (R.isNil(subscriberMeta) || subscriberMeta.isAlive === false) {

                  return ws.terminate();
                }

                const preparedSubscriberMeta = {
                  ...subscriberMeta,
                  isAlive: false,
                };

                subscribers.set(ws, preparedSubscriberMeta);

                ws.ping();
              },
            );
          },
          30000,
        );

        wss.on(
          `close`,
          () => {

            clearInterval(pingInterval);
          },
        );
      };
