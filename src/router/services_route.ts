import express from 'express';
import controller_Service from '../controller/controller_subService.js';

const rout = express.Router();

rout.get('/', controller_Service.getServices);
rout.get('/sub', controller_Service.getSubServices);

rout.post('/', controller_Service.setService);
rout.post('/sub', controller_Service.setSubService);

rout.patch('/', controller_Service.updateService);
rout.patch('/sub', controller_Service.updateSubService);

rout.delete('/', controller_Service.deleteService);
rout.delete('/sub', controller_Service.deleteSubService);


export default rout
