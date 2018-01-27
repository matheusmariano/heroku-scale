import * as uuid from 'uuid/v1';
import { Buffer } from 'buffer';
import amqp from '../../services/rabbitmq';
import { createFibDyno, stopDyno } from '../../services/heroku';

export default {
  process: (request, response) => {
    createFibDyno().then(async (dyno) => {
      try {
        const connection = await amqp.connect();

        const channel = await connection.createChannel();

        const queue = await channel.assertQueue('', {
          exclusive: true,
        });

        const correlationId = uuid();
        const number = request.body.number;
        const serverQueue = 'server_queue';
        const queueName = queue.queue;

        console.log(` [x] Requesting fib(${number}).`);

        channel.consume(queueName, (message) => {
          if (message.properties.correlationId === correlationId) {
            const result = message.content.toString();

            connection.close();

            stopDyno(dyno.id);

            response.json({
              data: {
                result,
              },
            });
          }
        });

        channel.sendToQueue(serverQueue, new Buffer(number.toString()), {
          correlationId,
          replyTo: queueName,
        });
      } catch ($e) {
        stopDyno(dyno.id);

        response.status(500).json({
          error: 'Could not connect to queue.',
        });
      }
    }).catch((exception) => {
      response.status(500).json({
        error: 'Could not create dyno.',
      });
    });
  },
};
