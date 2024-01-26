const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.session.authorization;
  
    if (!token) {
      return res.status(401).json({ message: "Unauthorized. Token missing." });
    }
  
    try {
      const decoded = jwt.verify(token, "salaudeen"); 
  
     
      if (req.session.authorization && req.session.authorization.username === decoded.data) {
        next(); 
      } else {
        return res.status(401).json({ message: "Unauthorized. Invalid token." });
      }
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized. Invalid token." });
    }
  });
  
 
const PORT =3333;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running at 3333"));
