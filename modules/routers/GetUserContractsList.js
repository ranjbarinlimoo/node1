const express = require('express')
const router = express.Router()
const db = require("../stored_procedures/");
const middleware = require("../middleWares/token");


module.exports = router.get("/GetUserContractsList", middleware, async (req, res) => {
  try {
    const username = req.body.parameters.UserName;
    let result = await db.GetContractByCustomerUsername(username, req.username);

    if (!result.length)
      throw new Error("404");

    let finalResult = [];
    result.forEach((element) => {

      let newResult = {};
      newResult.id = element.id;
      newResult.description = element.description;
      newResult.price = element.price;
      result = finalResult.push(newResult);

    });

    res.send({
      result: finalResult,
      message: "OK"
    });


  } catch (e) {
    switch (e.message) {
      case "404" :
        res.status(404).send({
          result: null,
          message: "Username Not Found!"
        });
        break;
      case "400" :
        res.status(400).send({
          result: null,
          message: "Bad Input!"
        });
        break;
      default  :
        res.status(500).send({
          result: null,
          message: "Internal Server Or Database Error!",
          devMessage: e.message
        });
    }
  }

});