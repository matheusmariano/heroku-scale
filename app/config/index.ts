export default {
  app: require('./app').default,
  heroku: require('./heroku').default,
  rabbitmq: require('./rabbitmq').default,
};
