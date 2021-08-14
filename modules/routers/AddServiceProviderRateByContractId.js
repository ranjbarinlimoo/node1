const express = require("express");
const router = express.Router();
const db = require("../stored_procedures/");
const middleware = require("../middleWares/token");


module.exports =router.post("/AddServiceProviderRateByContractId", middleware, async (req, res) => {
  try {

    const {
      contractId,
      rate,
      description
    } = req.body.parameters;

    if (rate > 5 || rate < 0) {
      throw new Error("400");
    }
    let contract = await db.GetContract(contractId, req.username);

    if (!contract)
      throw new Error("404");

    const serviceProviderUserName = contract.serviceProvider;
    const customerUserName = contract.customer;

    let ratings = await db.GetRatingsByCustomerUsername(customerUserName, req.username);

    const check = ratings.every((element) => {

      return element.provider_username !== serviceProviderUserName;


    });

    let newRate;
    const avgRate = await calculateAvgRate(serviceProviderUserName, rate, req.username);
    if (!avgRate) {
      newRate = rate;
    } else
      newRate = avgRate;


    if (!check){


      ratings = ratings.filter((element) => element.provider_username === serviceProviderUserName);
      let rating = ratings[0];

      await db.UpdateRate(rating.rateid, newRate, description, rating.myFavorite, req.username);
      return res.status(200).send({
        result: {},
        message: "Edited!",
        status: 200
      });

    }

    await db.RegisterRate(customerUserName, serviceProviderUserName, newRate, description, req.username);

    res.status(201).send({
      result: {},
      message: "Added!",
      status: 201
    });

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

async function calculateAvgRate(serviceProviderUserName, currentRate, currentUsername) {

  const providerRates = await db.GetRatingsByServiceProvider(serviceProviderUserName, currentUsername);
  if (!providerRates.length)
    return null;
  let sum = 0;
  providerRates.forEach((element) => {

    sum += element.rate;

  });

  sum += currentRate;
  return Math.round(sum / (providerRates.length + 1));
}
