const express = require('express')
const router = express.Router()
const db = require("../stored_procedures/");
const middleware = require("../middleWares/token");


module.exports =router.patch("/EditMyFavoritesByContractId", middleware, async (req, res) => {
  try {

    const {
      contractId,
      isMyFavorite
    } = req.body.parameters;

    let contract = await db.GetContract(contractId, req.username);

    if (!contract)
      throw new Error("404");

    const serviceProviderUserName = contract.serviceProvider;
    const customerUserName = contract.customer;

    let rating = await db.GetRatingsByCustomerUsername(customerUserName, req.username);
    if (!rating.length) {
      await db.RegisterRate(customerUserName, serviceProviderUserName, 0, "", req.username);
      rating = await db.GetRatingsByCustomerUsername(customerUserName, req.username);
    }
    rating = rating[0];

    await db.UpdateRate(rating.rateid, rating.rate, rating.description, isMyFavorite, req.username);

    res.send({ message: "OK" });

  } catch (e) {
    switch (e.message) {
      case "404" :
        res.status(404).send({
          result: null,
          message: "Contract Not Found!"
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
