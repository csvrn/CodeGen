const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  oracleDir: process.env.ORCALE_DIR,
  dbUserName: process.env.DB_USERNAME,
  dbPwrd: process.env.DB_PWRD,
  conStr: process.env.CONNECTION_STR,
  newDir: process.env.NEW_DIR,
};
