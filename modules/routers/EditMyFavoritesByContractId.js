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
    rating = rating.filter((element)=> element.provider_username === serviceProviderUserName)
    if (!rating.length) {
      await db.RegisterRate(customerUserName, serviceProviderUserName, 0, "", req.username);
      rating = await db.GetRatingsByCustomerUsername(customerUserName, req.username);
    }
    rating = rating.filter((element)=> element.provider_username === serviceProviderUserName)
    rating = rating[0]
    await db.UpdateRate(rating.rateid, rating.rate, rating.description, isMyFavorite, req.username);

    res.send({ message: "OK" ,
      status: 200});

  } catch (e) {
    switch (e.message) {
      case "404" :
        res.status(404).send({
          result: null,
          message: "Contract Not Found!",
          status: 404
        });
        break;
      case "400" :
        res.status(400).send({
          result: null,
          message: "Bad Input!",
          status: 400
        });
        break;
      default  :
        res.status(500).send({
          result: null,
          message: "Internal Server Or Database Error!",
          devMessage: e.message,
          status: 500
        });
    }
  }


});
