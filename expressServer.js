const express = require("express");
const env = require("dotenv").config();
const chalk = require("chalk");
const routers = require("./modules/routers");


const app = express();
app.use(express.json());
app.use(routers);
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, x-access-token, Accept, Authorization");
  next();
});


app.listen(process.env.PORT, (err) => {

  if (err)
    return console.log(chalk.bgRedBright.bold("An Error Occurred!"));

  console.log(chalk.blue.bold("Express Server Listening On Port: " + process.env.PORT));
});



