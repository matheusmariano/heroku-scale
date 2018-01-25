import * as amqp from 'amqplib';
import config from '../config/';

export default {
  connect: (url = config.rabbitmq.host) => amqp.connect(url),
};
