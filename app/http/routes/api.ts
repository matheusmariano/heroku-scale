import * as express from 'express';
import HomeController from '../controllers/home';
import FibController from '../controllers/fib';

const router = express.Router();

router.get('/', HomeController.index);
router.get('/fib', FibController.process);

export default router;
