import { Request , Response } from "express";

export abstract class EmployeeAbs {
   abstract  GetEmployees(req : Request ,  res : Response): Promise<void> 
   abstract GetSpecificEmployee(req : Request , res : Response) : Promise<void>
   abstract SetEmployee (req : Request , res : Response) : Promise<void>
   abstract UpdateEmployee (req : Request , res : Response) : Promise<void>
   abstract GetEmployeeByService(req : Request , res : Response) : Promise <void>
   abstract DelateEmployee(req : Request , res : Response) : Promise<void>
}
