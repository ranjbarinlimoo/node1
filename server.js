const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader');
const env = require('dotenv').config()

const db = require('./modules/stored_procedures/')

const packageDefinition = protoLoader.loadSync('./prototypes/ranjbar.proto', {
    keepCase: false,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const pkg = grpc.loadPackageDefinition(packageDefinition).Frontend;


async function startServer() {
    let server = new grpc.Server();
    server.addService(pkg.CustomerPanel.service, {
        GetUserContractsList,
        GetServiceProviderByContractId,
        AddServiceProviderRateByContractId,
        GetContractById
    });
    server.bindAsync(process.env.GRPS_SERVER_HOST+':'+process.env.GRPS_SERVER_PORT, grpc.ServerCredentials.createInsecure(), () => {
        server.start();
    });
}
startServer()




async function GetUserContractsList(call, callback) {
    try {
        const username = JSON.parse((call.request.JSON)).UserName
        let result = await db.GetContractByCustomerUsername(username,username)

        let finalResult = []
        result.forEach((element)=>{

            let newResult = {}
            newResult.id = element.id
            newResult.description = element.description
            newResult.price = element.price
            result = finalResult.push(newResult)

        })

        finalResult = JSON.stringify(finalResult)

        callback(null, {JSON:finalResult,StatusCode:200})

    }catch (e) {
        callback(null, {JSON:null,StatusCode:500})
    }

}

async function GetContractById(call, callback) {
    try {
        const username = 'testUser_backEnd_Ranjbar'
        const Id = JSON.parse((call.request.JSON)).contractId
        let finalResult = await db.GetContract(Id,username)


        console.log(finalResult);
        finalResult = JSON.stringify(finalResult)

        callback(null, {JSON:finalResult,StatusCode:200})

    }catch (e) {
        callback(null, {JSON:null,StatusCode:500})
    }

}

async function GetServiceProviderByContractId(call, callback) {
    try {
        const username = 'testUser_backEnd_Ranjbar'
        const contractId = JSON.parse(call.request.JSON).Id

        let data_Contract = await db.GetContract(contractId,username)

        const serviceProviderUserName = data_Contract.serviceProvider
        let data_serviceProvider = await db.GetServiceProvider(serviceProviderUserName,username)

        const data_avatarFileId = data_serviceProvider.avatarFileId
        const serviceProviderFullName = data_serviceProvider.fullname
        const serviceProviderRate = data_serviceProvider.rate


        //TODO avatar Uncompleted

        callback(null, {JSON:JSON.stringify({avatar:data_avatarFileId,fullname:serviceProviderFullName,rate:serviceProviderRate}),StatusCode:200})

    }catch (e) {
        callback(null, {JSON:null,StatusCode:500})
    }

}

async function AddServiceProviderRateByContractId(call, callback) {
    try {
        const username = 'testUser_backEnd_Ranjbar'
        const {contractId,rate,description} = JSON.parse(call.request.JSON)

        if (rate > 5 && rate < 0){
            callback(null, {JSON:JSON.stringify({}),StatusCode:400})
        }

        let data_Contract = await db.GetContract(contractId,username)

        const serviceProviderUserName = data_Contract.serviceProvider
        const customerUserName = data_Contract.customer
        let data_serviceProvider = await db.GetServiceProvider(serviceProviderUserName,username)

        await db.RegisterRate(customerUserName,serviceProviderUserName,rate,description,username)


        callback(null, {JSON:JSON.stringify({}),StatusCode:200})

    }catch (e) {
        console.log(e);
        callback(null, {JSON:null,StatusCode:500})
    }

}
