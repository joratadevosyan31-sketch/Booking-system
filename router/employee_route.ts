import express from 'express';

const employee = express.Router();

employee.get('/' , () => { console.log('hello')});


export default employee;