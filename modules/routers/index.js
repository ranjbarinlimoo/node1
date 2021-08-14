const express = require('express')
const router = express.Router()

const GetUserContractsList = require('./GetUserContractsList')
const GetContractById = require('./GetContractById')
const GetServiceProviderByContractId = require('./GetServiceProviderByContractId')
const AddServiceProviderRateByContractId = require('./AddServiceProviderRateByContractId')
const EditMyFavoritesByContractId = require('./EditMyFavoritesByContractId')
const IsMyFavoriteByContractId = require('./IsMyFavoriteByContractId')

router.use(GetUserContractsList)
router.use(GetContractById)
router.use(GetServiceProviderByContractId)
router.use(AddServiceProviderRateByContractId)
router.use(EditMyFavoritesByContractId)
router.use(IsMyFavoriteByContractId)

module.exports =router

