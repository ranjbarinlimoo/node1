const grpc = require('@grpc/grpc-js')
const loader = require('@grpc/proto-loader')


const pkgDef = loader.loadSync('PATH/TO/PROTO_FILE',
//TODO Edit                                 /\this
    { keepCase: false, longs: String, enums: String, defaults: true, oneofs: true
    }
)

const pkg = grpc.loadPackageDefinition(pkgDef).Frontend
const client = new pkg.CustomerPanel('GRPC_SERVER', grpc.credentials.createInsecure())
//TODO Edit                             /\this



//APIs With Examples
//                    Uncomment log codes for see the results in object format.

client.GetUserContractsList({
    JSON: JSON.stringify({ UserName: 'moharrami' })},(err,res) => {

    const data = JSON.parse(res.JSON)
    // console.log(data);
})


client.GetContractById({
    JSON: JSON.stringify({ contractId: '1' })},(err,res) => {

    const data = JSON.parse(res.JSON)
    // console.log(data);
})


client.GetServiceProviderByContractId({
    JSON: JSON.stringify({ contractId: '1' })},(err,res) => {

    const data = JSON.parse(res.JSON)
    // console.log(data);
})


client.AddServiceProviderRateByContractId({
    JSON: JSON.stringify({ contractId: '1' , rate: 2 , description: 'A lazy person.' })},(err,res) => {

    const data = JSON.parse(res.JSON)
    // console.log(data);
})


client.EditMyFavoritesByContractId({
    JSON: JSON.stringify({ contractId: '1' , isMyFavorite: true})},(err,res) => {

    const data = JSON.parse(res.JSON)
    // console.log(data);
})


client.IsMyFavoriteByContractId({
    JSON: JSON.stringify({ contractId: '1' })},(err,res) => {

    const data = JSON.parse(res.JSON)
    // console.log(data);
})