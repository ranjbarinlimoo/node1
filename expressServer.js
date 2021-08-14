const express = require("express");
const env = require("dotenv").config();
const chalk = require("chalk");
const routers = require("./modules/routers");
const bodyParser = require("body-parser");


const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(routers);
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE,PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, x-access-token, Accept, Authorization");
  next();
});
app.get('/test',(req,res)=>{

  console.log('//test');
  console.log('req.body');
  console.log(req.body);
  console.log('req.query');
  console.log(req.query);
  console.log('req.params');
  console.log(req.params);
  res.status(200).send({body:req.body,query:req.query,params:req.params});


})


app.listen(process.env.PORT, (err) => {

  if (err)
    return console.log(chalk.bgRedBright.bold("An Error Occurred!"));

  console.log(chalk.blue.bold("Express Server Listening On Port: " + process.env.PORT));
});



