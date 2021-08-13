const GetUserContractsList = require('./CustomerPanel/GetUserContractsList')
const GetContractById = require('./CustomerPanel/GetContractById')
const GetServiceProviderByContractId = require('./CustomerPanel/GetServiceProviderByContractId')
const AddServiceProviderRateByContractId = require('./CustomerPanel/AddServiceProviderRateByContractId')
const EditMyFavoritesByContractId = require('./CustomerPanel/EditMyFavoritesByContractId')
const IsMyFavoriteByContractId = require('./CustomerPanel/IsMyFavoriteByContractId')


module.exports = {

  GetUserContractsList ,
  GetContractById ,
  GetServiceProviderByContractId ,
  AddServiceProviderRateByContractId,
  EditMyFavoritesByContractId ,
  IsMyFavoriteByContractId ,

}