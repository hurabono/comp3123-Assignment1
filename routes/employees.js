/*

    /api/v1/emp/employees
    /api/v1/emp/employees
    /api/v1/emp/employees/{eid}
    /api/v1/emp/employees/{eid} 
    /api/v1/emp/employees?eid=xxx

*/

const express = require('express');
const Employee = require('../models/Employee');
const User = require('../models/User'); 
const routes = express.Router();
const mongoose = require("mongoose");


// Mongoose connect 
const DB_CONNECTION_STRING = "mongodb+srv://stephfee:y69kjrSYJi5BdBs6@productdb.mmelk.mongodb.net/?retryWrites=true&w=majority&appName=productdb"; ;

mongoose.connect( DB_CONNECTION_STRING,{ // connect is the calling promise
    useNewUrlParser: true,
    useUnifiedTopology: true

}).then(() => {
    console.log("MongoDB for employees! connected well!! ");

}).catch(err => {
    console.error("MongoDB connection for employee error:", err);

});




// get employee list
routes.get('/employees', async (req, res) => {

    // get login information
    const user = await User.findById(req.session.userId);

    // User authorization
    if (!req.session.userId) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    // If authorized, Employee should be showed up 
    const employees = await Employee.find();
        res.send({ message: `Welcome! ${user.username}`, data: employees });

});




// post employees
routes.post('/employees', async (req, res)=>{

    try {

        const { first_name, last_name, email, position, salary, date_of_joining, department } = req.body;

        // setting new employee
        const newEmployee = new Employee({
            first_name,
            last_name,
            email,
            position,
            salary,
            date_of_joining,
            department
        });

        const savedEmployee = await newEmployee.save();

        res.status(201).send({ message: 'Employee created successfully', data: savedEmployee });

    } catch(err){
        res.status(500).send({ message: err.message });
    }

});




//User can get employee details by employee id
routes.get("/employees/:eid", (req, res) => {

    // only authorized user is able to access
    // User authorization
    if (!req.session.userId) {
        return res.status(401).send({ message: 'Unauthorized' });
    }
    
    Employee.findById(req.params.eid).then((employee) => {
        if (employee) {
            res.send(employee);
        } else {
            res.status(404).send({ message: "We cannot find the employee. Please check again" });
        }
    }).catch((err) => {
        res.status(500).send({ message: err.message });
    });

})




//User can update employee details
routes.put('/employees/:eid', async (req,res)=>{

    //only authorized user is able to access
    // User authorization
    if (!req.session.userId) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    Employee.findByIdAndUpdate(req.params.eid, req.body, {new:true}).then( (employee)=> {
        if(employee){
            res.send(employee)
        }else{
            res.status(404).send({ message: "We can not find employee" })
        }
        
    }).catch( (err)=>{
        res.status(500).send({message: err.message})
    })

});




// User can delete employee by employee id

routes.delete("/employees", (req, res) => {

    //access the eid parameter
    const employeeId = req.query.eid;

    if (!employeeId) {
         return res.status(400)
         .send({ message: "Employee ID is required" }); 
        }

    Employee.findByIdAndDelete(employeeId).then( (employee)=> {
        if(employee){
            res.send(employee)
        }else{
            res.status(404).send({ message: "We can not find employee" })
        }
    }).catch( (err)=>{
        res.status(500).send({message: err.message})
    })

})




module.exports = routes;
