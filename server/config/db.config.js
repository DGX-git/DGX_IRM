// const config = { 
// 	USER: "postgres",
//     HOST: "192.168.1.105" ,
//     DATABASE: "DGX",
// 	PASSWORD: "root",
//     DIALECT: "postgres",
//     PORT: "7894"
// } 

// module.exports = config;

const config = {
  USER: "postgres",
  HOST: "db.sikkkmofjpnpkxtblyie.supabase.co",
  DATABASE: "postgres",
  PASSWORD: "4lMAloXIN2pbfxYq",
  DIALECT: "postgres",
  PORT: 5432,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};

module.exports = config;
