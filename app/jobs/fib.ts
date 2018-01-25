import '../services/environment';
import amqp from '../services/rabbitmq';

amqp.connect().then(async (connection) => {
  const channel = await connection.createChannel();

  const serverQueue = 'server_queue';

  channel.assertQueue(serverQueue, {
    durable: false,
  });

  console.log(' [x] Awaiting requests.');

  channel.consume(serverQueue, (message) => {
    const number = message.content.toString();
    const replyTo = message.properties.replyTo;

    console.log(` [.] fib(${number}).`);

    const result = 8;

    channel.sendToQueue(replyTo, new Buffer(result.toString()), {
      correlationId: message.properties.correlationId,
    });

    channel.ack(message);
  });
});
