const express = require('express')
const router = express.Router()
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

    const data = await db.GetRatingsByCustomerUsername(customerUserName, req.username);

    const check = data.every((element) => {

      return element.provider_username !== serviceProviderUserName;


    });
    if (!check)
      throw new Error("405");

    let newRate;
    const avgRate = await calculateAvgRate(serviceProviderUserName, rate, req.username);
    if (!avgRate)
      newRate = rate;
    else
      newRate = avgRate;

    await db.RegisterRate(customerUserName, serviceProviderUserName, newRate, description, req.username);

    res.status(201).send({
      result: {},
      message: "Added!"
    });

  } catch (e) {
    switch (e.message) {
      case "404" :
        res.status(404).send({
          result: null,
          message: "Contract Not Found!"
        });
        break;

      case "405" :
        res.status(400).send({
          result: null,
          message: "Already Rated This Provider!"
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
