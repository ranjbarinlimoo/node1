const db = require('../modules/stored_procedures/')


async function run() {

    setTimeout(async () => {

        const username = 'testUser_backEnd_Ranjbar'
        const user = await db.GetContract('2', username)
        console.log(user)


    },1000)

}
run()