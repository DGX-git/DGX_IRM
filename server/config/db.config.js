// local
// const config = {
// 	USER: "postgres",
//     HOST: "192.168.1.105" ,
//     DATABASE: "DGX",
// 	PASSWORD: "root",
//     DIALECT: "postgres",
//     PORT: "7894"
// }

// module.exports = config;

// QA
// const config = {
// 	USER: "postgres",
//     HOST: "192.168.1.105" ,
//     DATABASE: "qa_dgx",
// 	PASSWORD: "root",
//     DIALECT: "postgres",
//     PORT: "7894"
// }

// module.exports = config;

// supabase
// const config = {
//   USER: "postgres",
//   HOST: "db.sikkkmofjpnpkxtblyie.supabase.co",
//   DATABASE: "postgres",
//   PASSWORD: "4lMAloXIN2pbfxYq",
//   DIALECT: "postgres",
//   PORT: 5432,
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false,
//     },
//     family: 4, // <--- Force IPv4
//   },
// };

// module.exports = config;


require('dotenv').config();

const config = {
  USER: process.env.DB_USER,
  HOST: process.env.DB_HOST,
  DATABASE: process.env.DB_NAME,
  PASSWORD: process.env.DB_PASSWORD,
  DIALECT: "postgres",
  PORT: process.env.DB_PORT || 5432,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

module.exports = config;