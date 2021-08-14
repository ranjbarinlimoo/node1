const express = require('express')
const router = express.Router()
const db = require("../stored_procedures/");
const middleware = require("../middleWares/token");


module.exports =router.get("/GetContractById", middleware, async (req, res) => {
  try {

    const Id = req.body.parameters.contractId;
    const contract = await db.GetContract(Id, req.username);

    if (!contract)
      throw new Error("404");

    const customer = await db.GetCustomer(contract.customer, req.username);
    const serviceProvider = await db.GetServiceProvider(contract.serviceProvider, req.username);
    const user_serviceProvider = await db.GetUser(contract.serviceProvider, req.username);
    const ratings = await db.GetRatingsByCustomerUsername(contract.customer, req.username);

    const providerRate = ratings.filter((element) => element.provider_username === contract.serviceProvider);
    let rateByThisCustomer;
    if (!ratings.length) {
      rateByThisCustomer = null;
    } else {
      rateByThisCustomer = providerRate[0].rate;
    }

    const providerName = serviceProvider.fullname;
    const providerPhone = serviceProvider.tel;
    const avatar = await db.GetFileData(user_serviceProvider.avatarFileId, req.username);

    let avatar_base64 = null;
    if (avatar)
      avatar_base64 = Buffer.from(avatar.data).toString("base64");


    let isMyFavotite = false;
    if (providerRate.myFavorite)
      isMyFavotite = true;
    const rate = serviceProvider.rate;
    const contractDetails = contract.description;

    res.send({
      result: {
        providerName,
        providerPhone,
        avatar_base64,
        isMyFavotite,
        rate,
        rateByThisCustomer,
        contractDetails
      },message: "OK"
    });


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