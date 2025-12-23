import express from 'express';
import controller_Service from '../controller/controller_subService.js';
import { authenticateAdmin } from '../middleware/adminAuth_middleware.js';

const rout = express.Router();

rout.get('/', controller_Service.getServices);
rout.get('/sub', controller_Service.getSubServices);

rout.post('/', authenticateAdmin, controller_Service.setService);
rout.post('/sub', authenticateAdmin, controller_Service.setSubService);

rout.patch('/', authenticateAdmin, controller_Service.updateService);
rout.patch('/sub', authenticateAdmin, controller_Service.updateSubService);

rout.delete('/', authenticateAdmin, controller_Service.deleteService);
rout.delete('/sub', authenticateAdmin, controller_Service.deleteSubService);


export default rout
