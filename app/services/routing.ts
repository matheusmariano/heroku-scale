import * as express from 'express';
import config from '../config/';
import api from '../http/routes/api';

const app = express();
const port = config.app.port;

app.use('/', api);

app.listen(port, () => {
  console.log(`Listening at port ${port}.`);
});
