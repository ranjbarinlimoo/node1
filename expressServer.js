const express = require("express");
const env = require("dotenv").config();
const chalk = require("chalk");
const routers = require("./modules/routers");


const app = express();
app.use(express.json());
app.use(routers);

app.listen(process.env.PORT, (err) => {

  if (err)
    return console.log(chalk.bgRedBright.bold("An Error Occurred!"));

  console.log(chalk.blue.bold("Express Server Listening On Port: " + process.env.PORT));
});



