import { Router } from 'express';
import { SuprimentosController } from '../controllers/suprimentos.controller';

const router = Router();
const controller = new SuprimentosController();

router.get('/', controller.getSuprimentos);
router.get('/stream', controller.getStream);

export default router;
