import express from 'express';
import controller_employee from '../controller/controller_employee.js';
import { authenticateAdmin } from '../middleware/adminAuth_middleware.js';


const employee = express.Router();

employee.get('/', controller_employee.GetEmployees);
employee.post('/', authenticateAdmin, controller_employee.SetEmployee);
employee.get('/:employeeId', controller_employee.GetSpecificEmployee);
employee.get('/service/:serviceId', controller_employee.GetEmployeeByService);
employee.put('/:employeeId', authenticateAdmin, controller_employee.UpdateEmployee);
employee.delete('/:employeeId', authenticateAdmin, controller_employee.DelateEmployee);

export default employee;