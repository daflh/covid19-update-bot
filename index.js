const axios = require("axios");
const cron = require("node-cron");
const data = require("./lib/data.js");

require("dotenv").config();

let cronExpr = "0 6,18 * * *";

async function postToFacebook(){
    let {total, indonesia, affected, time} = await data();
    let msg = `Update Terbaru Virus Corona (COVID-19) di Indonesia

    - Terinfeksi: ${indonesia.infections}
    - Aktif: ${indonesia.active_cases}
    - Kematian: ${indonesia.deaths}
    - Sembuh: ${indonesia.recovered}

    Jumlah keseluruhan korban di seluruh dunia
    - Terinfeksi: ${total.infections}
    - Aktif: ${total.active_cases}
    - Kematian: ${total.deaths}
    - Telah pulih: ${total.recovered}
    - Tingkat kematian: ${total.mortality_rate}
    - Tingkat pemulihan: ${total.recovery_rate}
    - Jumlah terdampak: ${affected} negara

    Data diperbarui pada ${time}
    Info selengkapnya dapat diakses di http://thewuhanvirus.com`;
    let url = "https://graph.facebook.com/" + process.env.PAGE_ID + "/feed?access_token=" + process.env.ACCESS_TOKEN + "&message=" + encodeURI(msg);
    
    await axios.post(url);
}

cron.schedule(cronExpr, () => {
    postToFacebook();
    console.log("posted to facebook on " + new Date().toLocaleString());
}, { timezone: "Asia/Jakarta" });

console.log("server is running now");