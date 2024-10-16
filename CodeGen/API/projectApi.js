const express = require("express");
const cors = require("cors");
const app = express();

const oracledb = require("oracledb");
const dotenv = require("dotenv");
dotenv.config();
oracledb.initOracleClient({
  libDir: process.env.ORACLE_DIR,
});

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const dbCon = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PWRD,
  connectionString: process.env.CONNECTION_STR,
};
app.use(express.json());
app.use(cors());

async function getProjects() {
  let con;
  try {
    con = await oracledb.getConnection(dbCon);

    const projects = await con.execute(`SELECT * FROM CODEGEN.CD_PROJECT`);
    await con.close();
    return Object.values(projects.rows);
  } catch (err) {
    console.error(err);
  }
}

async function createProject({ AD, DATABASE_NAME, CONNECTION_STRING }) {
  let con;
  try {
    con = await oracledb.getConnection(dbCon);
    const insertQuery = `INSERT INTO CODEGEN.CD_PROJECT (AD, DATABASE_NAME, CONNECTION_STRING,USERNAME,PSWRD)
      VALUES (:ad, :dbName, :conStr, :username, :password)
    `;
    const bindParams = {
      ad: AD,
      dbName: DATABASE_NAME,
      conStr: CONNECTION_STRING,
      username: "tst",
      password: "-",
    };

    const result = await con.execute(insertQuery, bindParams);

    await con.commit();
    await con.close();
    return result;
  } catch (err) {
    console.error(err);
  }
}
async function updateProject({ name, database, connectionString }) {
  let con;
  try {
    con = await oracledb.getConnection(dbCon);

    const updateQuery = `UPDATE CODEGEN.CD_PROJECT SET AD= '${name}', DATABASE_NAME ='${database}' , CONNECTION_STRING='${connectionString}',USERNAME='TST',PSWRD='TST' WHERE AD='${name}'`;

    const result = await con.execute(updateQuery);
    await con.commit();
    await con.close();
    return result;
  } catch (err) {
    console.error(err);
  }
}

async function deleteProject({ name }) {
  let con;
  try {
    con = await oracledb.getConnection(dbCon);
    const deleteQuery = `DELETE FROM CODEGEN.CD_PROJECT WHERE AD= '${name}'`;
    const result = await con.execute(deleteQuery);
    await con.commit();
    await con.close();
    return result;
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
};
