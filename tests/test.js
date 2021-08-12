const db = require("../modules/stored_procedures/");
const fs = require("fs");

async function run() {

  setTimeout(async () => {

    const username = "testUser_backEnd_Ranjbar";
    const data = await db.GetRatingsByCustomerUsername("moharrami", username);
    console.log(data);


  }, 1000);

}

run();

// اسم سرویس دهنده - تلفنش - عکسش - اینکه جزو منتخب ها هست یا نه - میانگین امتیازش - و امتیازی این کاربر برای این متخصص ثبت کرده
//
//
// بعلاوه ی توضیحات سفارش