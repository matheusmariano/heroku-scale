import * as Heroku from 'heroku-client';
import config from '../config/';

const heroku = new Heroku({ token: config.heroku.token });

export const createDyno = (params, appId = config.heroku.app.id) =>
  heroku.post(`/apps/${appId}/dynos`, params);

export const createFibDyno = (appId = config.heroku.app.id) =>
  createDyno({
    body: {
      command: 'node dist/jobs/fib.js',
      type: 'worker',
      time_to_live: 60,
    },
  });

export const stopDyno = (dynoId, appId = config.heroku.app.id) =>
  heroku.post(`/apps/${appId}/dynos/${dynoId}/actions/stop`);

export default heroku;
