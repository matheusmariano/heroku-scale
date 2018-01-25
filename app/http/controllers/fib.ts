import * as uuid from 'uuid/v1';
import { Buffer } from 'buffer';
import amqp from '../../services/rabbitmq';
import { createDyno } from '../../services/heroku';

export default {
  process: (request, response) => {
    createDyno().then(async (dyno) => {
      const connection = await amqp.connect();

      const channel = await connection.createChannel();

      const queue = await channel.assertQueue('', {
        exclusive: true,
      });

      const correlationId = uuid();
      const number = request.body.number;
      const queueName = queue.queue;

      console.log(` [x] Requesting fib(${number}).`);

      channel.consume(queueName, (message) => {
        if (message.properties.correlationId === correlationId) {
          const result = message.content.toString();

          connection.close();

          response.json({
            data: {
              result,
            },
          });
        }
      });

      channel.sendToQueue('server_queue', new Buffer(number.toString()), {
        correlationId,
        replyTo: queueName,
      });
    });
  },
};
