require("dotenv").config({ path: "variables.env" });

module.exports = {
    host:process.env.HOST,
    port:process.env.EMAILPORT,
    auth:{
        user:process.env.USER,
        pass:process.env.PASS
    }
}