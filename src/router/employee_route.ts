import express from 'express';
import controller_employee from '../controller/controller_employee.js';


const employee = express.Router();

employee.get('/', controller_employee.GetEmployees);
employee.post('/', controller_employee.SetEmployee);
employee.get('/:employeeId', controller_employee.GetSpecificEmployee);
employee.get('/service', controller_employee.GetEmployeeByService);
employee.put('/:employeeId', controller_employee.UpdateEmployee);
employee.delete('/:employeeId', controller_employee.DelateEmployee);

export default employee;