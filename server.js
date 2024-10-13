//COMP3123 Assignment1 2024-10-09
// T177 101083889 HEESU CHO

/*NOTE

- Make use of express.Routes() and modules
- Validate the data whenever required
- Return error details or success response details whenever required
- All data must be sent back and forth in JSON Object format
- Optionally apply JWT security concept to secure all your API calls
- No late submission

*/

/* 
    1. server
    2. models - User.js, Employee.js
    3. routes - users.js  employees.js
*/


const express = require('express');
const userRoutes = require('./routes/users');
const employeeRoutes = require('./routes/employees');
const SERVER_PORT = process.env.PORT || 3001;
const app = express();
const path = require('path');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// mongoDB log-in session settings 
const session = require('express-session');
app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: true
}));




app.use('/api/v1/user', userRoutes); 
app.use('/api/v1/emp/', employeeRoutes); 


app.use(express.static(path.join(__dirname, 'public'))); 


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html')); 
});


app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
  });


app.listen(SERVER_PORT, () => {
    console.log(`Server running http://localhost:${SERVER_PORT}/`);
});


module.exports = app;

