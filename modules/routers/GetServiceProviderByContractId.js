const express = require('express')
const router = express.Router()
const db = require("../stored_procedures/");
const middleware = require("../middleWares/token");


module.exports =router.get("/GetServiceProviderByContractId", middleware, async (req, res) => {
  try {

    const contractId = req.body.parameters.contractId;

    const contract = await db.GetContract(contractId, req.username);

    if (!contract)
      throw new Error("404");

    const serviceProviderUserName = contract.serviceProvider;
    const user_serviceProvider = await db.GetUser(serviceProviderUserName, req.username);
    const ServiceProvider = await db.GetServiceProvider(serviceProviderUserName, req.username);

    const serviceProviderAvatarFileId = user_serviceProvider.avatarFileId;
    const serviceProviderFullName = ServiceProvider.fullname;
    const serviceProviderRate = ServiceProvider.rate;

    const avatar = await db.GetFileData(serviceProviderAvatarFileId, req.username);

    let avatar_base64 = null;
    if (avatar)
      avatar_base64 = await Buffer.from(avatar.data).toString("base64");

    res.send({
      result: {

        avatar: avatar_base64,
        fullname: serviceProviderFullName,
        rate: serviceProviderRate

      },
      message: "OK"
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
      default  :{res.status(500).send({
        result: null,
        message: "Internal Server Or Database Error!",
        devMessage: e.message
      });
        console.log(e);}

    }
  }
});