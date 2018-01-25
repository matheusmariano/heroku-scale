import Heroku from 'heroku-client';
import config from '../config/';

const heroku = new Heroku({ token: config.heroku.token });

export const createDyno = (appId = config.heroku.app.id) =>
  heroku.post(`/apps/${appId}/dynos`, {
    body: {
      command: 'node dist/jobs/fib.js',
      type: 'worker',
    },
  });

export default heroku;
