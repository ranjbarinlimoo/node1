const sql = require('mssql')

module.exports = new (class DB {
  constructor() {
    this.sqlConfig = {
      user: 'ranjbar',
      password: '3DpPf3YGAb5QkaG',
      database: 'Limoo_Trial',
      server: '185.128.82.62',
      port: 11433,
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
      },
      options: {
        encrypt: true, // for azure
        trustServerCertificate: true, // change to true for local dev / self-signed certs
      },
    }
    this.connect(this.sqlConfig).then(r => console.log('DB Connected'))
  }

  async connect(sqlConfig) {
    if (!this.pool) this.pool = await sql.connect(sqlConfig)
  }

  async RegisterSession(username, ip) {
    const data = await this.pool.request()
        .input('username', sql.NVarChar(32), username)
        .input('ip', sql.VarBinary(16), Buffer.from(ip))
        .execute('RegisterSession');
    return JSON.parse(JSON.stringify(data)).recordset[0]
  }

  // async GetSession(id, opr_username) {
  //   const data = await this.pool.request()
  //       .input('id', sql.BigInt, id)
  //       .input('opr_username', sql.NVarChar(32), opr_username)
  //       .execute('GetSession');
  // return JSON.parse(JSON.stringify(data)).recordset[0]
  // }

  //Returns @sessionID (BigInt)
  // async GetUserSession(id, username) {
  //   const data = await this.pool.request()
  //       .input('username', sql.NVarChar(32), username)
  //       .execute('GetUserSession');
  // return JSON.parse(JSON.stringify(data)).recordset[0]
  // }

  // async UpdateSession(id, username,ip,start,end,status,opr_username) {
  //   const data = await this.pool.request()
  //       .input('id', sql.BigInt, id)
  //       .input('username', sql.NVarChar(32), username)
  //       .input('ip', sql.VarBinary(16), Buffer.from(ip))
  //       .input('start', sql.Int, start)
  //       .input('end', sql.Int, end)
  //       .input('status', sql.VarChar(255), status)
  //       .input('opr_username', sql.NVarChar(32), opr_username)
  //       .execute('UpdateSession');
  // return JSON.parse(JSON.stringify(data)).recordset[0]
  // }

  async RegisterUser(username,status,regDateTime,lastUpdate,role,isDeleted,opr_username) {
    const data = await this.pool.request()
        .input('username', sql.NVarChar(32), username)
        .input('status', sql.NVarChar(32), status)
        .input('regDateTime', sql.Int, regDateTime)
        .input('lastUpdate', sql.Int, lastUpdate)
        .input('role', sql.NVarChar(16), role)
        .input('isDeleted', sql.Bit, isDeleted)
        .input('opr_username', sql.NVarChar(32), opr_username)
        .execute('RegisterUser');
    return JSON.parse(JSON.stringify(data)).recordset[0]
  }

  async GetUser(username, opr_username) {
    const data = await this.pool.request()
        .input('username', sql.NVarChar(32), username)
        .input('opr_username', sql.NVarChar(32), opr_username)
        .execute('GetUser');
    return JSON.parse(JSON.stringify(data)).recordset[0]
  }

  async UpdateUser(username,status,role,isDeleted,opr_username) {
    const data = await this.pool.request()
        .input('username', sql.NVarChar(32), username)
        .input('status', sql.NVarChar(32), status)
        .input('role', sql.NVarChar(16), role)
        .input('isDeleted', sql.Bit, isDeleted)
        .input('opr_username', sql.NVarChar(32), opr_username)
        .execute('UpdateUser');
    return JSON.parse(JSON.stringify(data)).recordset[0]
  }

  async DeleteUser(username, opr_username) {
    const data = await this.pool.request()
        .input('username', sql.NVarChar(32), username)
        .input('opr_username', sql.NVarChar(32), opr_username)
        .execute('DeleteUser');
    return JSON.parse(JSON.stringify(data)).recordset[0]
  }

  async RegisterCustomer(username,fullname,tel,city,address,reputation,opr_username) {
    const data = await this.pool.request()
        .input('username', sql.NVarChar(32), username)
        .input('fullname', sql.NVarChar(255), fullname)
        .input('tel', sql.VarChar(32), tel)
        .input('city', sql.VarChar(32), city)
        .input('address', sql.VarChar(32), address)
        .input('reputation', sql.Int, reputation)
        .input('opr_username', sql.NVarChar(32), opr_username)
        .execute('RegisterCustomer');
    return JSON.parse(JSON.stringify(data)).recordset[0]
  }

  async UpdateCustomer(username,fullname,tel,city,address,reputation,opr_username) {
    const data = await this.pool.request()
        .input('username', sql.NVarChar(32), username)
        .input('fullname', sql.NVarChar(255), fullname)
        .input('tel', sql.VarChar(32), tel)
        .input('city', sql.VarChar(32), city)
        .input('address', sql.VarChar(32), address)
        .input('reputation', sql.Int, reputation)
        .input('opr_username', sql.NVarChar(32), opr_username)
        .execute('UpdateCustomer');
    return JSON.parse(JSON.stringify(data)).recordset[0]
  }

  async GetCustomer(username, opr_username) {
    const data = await this.pool.request()
        .input('username', sql.NVarChar(32), username)
        .input('opr_username', sql.NVarChar(32), opr_username)
        .execute('GetCustomer');
    return JSON.parse(JSON.stringify(data)).recordset[0]
  }

  async RegisterContract(serviceId, subServiceId,selectedDescription,customer,
                    serviceProvider,pieces,description,selectedTime,address,
                    mapPoint,showTel,customerEstimation,discountCode,
                    regDateTime,lastUpdate,maxTime,status,payments,opr_username) {
    const data = await this.pool.request()
        .input('serviceId', sql.Int, serviceId)
        .input('subServiceId', sql.Int, subServiceId)
        .input('selectedDescription', sql.NVarChar(255), selectedDescription)
        .input('customer', sql.NVarChar(32), customer)
        .input('serviceProvider', sql.NVarChar(32), serviceProvider)
        .input('pieces', sql.NVarChar(1024), pieces)
        .input('description', sql.NVarChar(1024), description)
        .input('selectedTime', sql.Int, selectedTime)
        .input('mapPoint', sql.VarChar(64), mapPoint)
        .input('showTel', sql.Bit, showTel)
        .input('customerEstimation', sql.Int, customerEstimation)
        .input('discountCode', sql.NVarChar(32), discountCode)
        .input('regDateTime', sql.Int, regDateTime)
        .input('lastUpdate', sql.Int, lastUpdate)
        .input('maxTime', sql.Int, maxTime)
        .input('status', sql.VarChar(64), status)
        .input('payments', sql.VarChar(255), payments)
        .input('opr_username', sql.NVarChar(32), opr_username)
        .execute('RegisterContract');
    return JSON.parse(JSON.stringify(data)).recordset[0]
  }


  async GetContract(id, opr_username) {
    const data = await this.pool.request()
        .input('id', sql.Int, id)
        .input('opr_username', sql.NVarChar(32), opr_username)
        .execute('GetContract');
    return JSON.parse(JSON.stringify(data)).recordset[0]
  }

  async GetContractByCustomerUsername(cutomer_username, opr_username) {
    const data = await this.pool.request()
        .input('cutomer_username', sql.NVarChar(32), cutomer_username)
        .input('opr_username', sql.NVarChar(32), opr_username)
        .execute('GetContractByCustomerUsername');
    return JSON.parse(JSON.stringify(data)).recordset
  }

  async UpdateContract(id,serviceId, subServiceId,selectedDescription,customer,
                         serviceProvider,pieces,description,selectedTime,address,
                         mapPoint,showTel,customerEstimation,discountCode,
                         regDateTime,lastUpdate,maxTime,status,payments,opr_username) {
    const data = await this.pool.request()
        .input('id', sql.Int, id)
        .input('serviceId', sql.Int, serviceId)
        .input('subServiceId', sql.Int, subServiceId)
        .input('selectedDescription', sql.NVarChar(255), selectedDescription)
        .input('customer', sql.NVarChar(32), customer)
        .input('serviceProvider', sql.NVarChar(32), serviceProvider)
        .input('pieces', sql.NVarChar(1024), pieces)
        .input('description', sql.NVarChar(1024), description)
        .input('selectedTime', sql.Int, selectedTime)
        .input('mapPoint', sql.VarChar(64), mapPoint)
        .input('showTel', sql.Bit, showTel)
        .input('customerEstimation', sql.Int, customerEstimation)
        .input('discountCode', sql.NVarChar(32), discountCode)
        .input('regDateTime', sql.Int, regDateTime)
        .input('lastUpdate', sql.Int, lastUpdate)
        .input('maxTime', sql.Int, maxTime)
        .input('status', sql.VarChar(64), status)
        .input('payments', sql.VarChar(255), payments)
        .input('opr_username', sql.NVarChar(32), opr_username)
        .execute('UpdateContract');
    return JSON.parse(JSON.stringify(data)).recordset[0]
  }

  async RegisterFile(filename, extention,sha256,data,opr_username) {
    const data1 = await this.pool.request()
        .input('filename', sql.NVarChar(64), filename)
        .input('extention', sql.VarChar(16), extention)
        .input('sha256', sql.VarChar(256), sha256)
        .input('data', sql.VarBinary(sql.MAX), data)
        .input('opr_username', sql.NVarChar(32), opr_username)
        .execute('RegisterFile');
    return JSON.parse(JSON.stringify(data1)).recordset[0]
  }

  async GetFileInfo(fileId,opr_username) {
    const data = await this.pool.request()
        .input('fileId', sql.VarChar(32), fileId)
        .input('opr_username', sql.NVarChar(32), opr_username)
        .execute('GetFileInfo');
    return JSON.parse(JSON.stringify(data)).recordset[0]
  }

  async GetFileData(fileId,opr_username) {
    const data = await this.pool.request()
        .input('fileId', sql.VarChar(64), fileId)
        .input('opr_username', sql.NVarChar(32), opr_username)
        .execute('GetFileData');
    return JSON.parse(JSON.stringify(data)).recordset[0]
  }

  //Returns PersianFormat Date
  async GetPersianDateTimeInt(fileId,opr_username) {
    const result = await this.pool.request()
        .execute('GetPersianDateTimeInt');

    return result.output['']
  }

  async GetServiceProvider(username,opr_username) {
    const data = await this.pool.request()
        .input('username', sql.NVarChar(32), username)
        .input('opr_username', sql.NVarChar(32), opr_username)
        .execute('GetServiceProvider');
    return JSON.parse(JSON.stringify(data)).recordset[0]
  }

  async RegisterRate(customer_username,service_provider_username,rate,description, opr_username) {
    const data = await this.pool.request()
      .input('customer_username', sql.NVarChar(32), customer_username)
      .input('service_provider_username', sql.NVarChar(32), service_provider_username)
      .input('rate', sql.TinyInt, rate)
      .input('description', sql.NVarChar(300), description)
      .input('opr_username', sql.NVarChar(32), opr_username)
      .execute('RegisterRate');
    return JSON.parse(JSON.stringify(data)).recordset[0]
  }

  async GetRatingsByCustomerUsername(customer_username,opr_username) {
    const data = await this.pool.request()
      .input('customer_username', sql.NVarChar(32), customer_username)
      .input('opr_username', sql.NVarChar(32), opr_username)
      .execute('GetRatingsByCustomerUsername');
    return JSON.parse(JSON.stringify(data)).recordset
  }

  async UpdateRate(rateId,rate,description,myFavorite,opr_username) {
    const data = await this.pool.request()
      .input('rateid', sql.NVarChar(32), rateId)
      .input('myFavorite', sql.Bit, myFavorite)
      .input('rate', sql.TinyInt, parseInt(rate))
      .input('description', sql.NVarChar(300), description)
      .input('opr_username', sql.NVarChar(32), opr_username)
      .execute('UpdateRate');
    return JSON.parse(JSON.stringify(data)).recordset[0]
  }

})()
