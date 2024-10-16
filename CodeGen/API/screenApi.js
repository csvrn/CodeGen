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

app.use(express.json());
app.use(cors());
const dbCon = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PWRD,
  connectionString: process.env.CONNECTION_STR,
};
async function getScreens(menuId = 0) {
  let con;
  try {
    con = await oracledb.getConnection(dbCon);
    const query = `SELECT * FROM CODEGEN.CD_SCREEN ${
      menuId != 0 ? `WHERE ID = ${menuId}` : ``
    }`;
    const screens = await con.execute(query);

    await con.close();
    return Object.values(screens.rows);
  } catch (err) {
    console.error(err);
  }
}
async function getScreensWithMenu(menuId = 0) {
  let con;
  try {
    con = await oracledb.getConnection(dbCon);
    const query = `SELECT * FROM CODEGEN.CD_SCREEN ${
      menuId != 0 ? `WHERE ID = ${menuId}` : ``
    }`;
    const joinQuery = `
    SELECT S.*, m.AD as MENU_NAME
    FROM CODEGEN.CD_SCREEN s
    LEFT JOIN CODEGEN.CD_MENU m ON s.MENU_ID= m.ID`;

    const screens = await con.execute(query);

    const screenWithMenu = await con.execute(joinQuery);

    await con.close();
    return Object.values(screenWithMenu.rows);
  } catch (err) {
    console.error(err);
  }
}
async function createScreen({
  MENU_ID,
  URL,
  AD,
  SIRA_NO,
  CONTROLLER,
  GORUNSUN_MU,
  SEARCH_ON_LOAD,
  SHOW_NEW_ITEM,
  SHOW_EDIT,
  SHOW_DELETE,
  ISACTIVE,
}) {
  let con;
  try {
    con = await oracledb.getConnection(dbCon);
    const insertQuery = `INSERT INTO CODEGEN.CD_SCREEN (MENU_ID, URL, AD, SIRA_NO, CONTROLLER, GORUNSUN_MU, SEARCH_ON_LOAD, SHOW_NEW_ITEM, SHOW_EDIT, SHOW_DELETE, ISACTIVE)
      VALUES (:menuId, :url, :ad, :siraNo, :controller, :gorunsunMu, :searchOnLoad, :showNewItem, :showEdit, :showDelete, :isActive)
    `;
    const bindParams = {
      menuId: MENU_ID,
      url: URL,
      ad: AD,
      siraNo: SIRA_NO,
      controller: CONTROLLER,
      gorunsunMu: GORUNSUN_MU,
      searchOnLoad: SEARCH_ON_LOAD,
      showNewItem: SHOW_NEW_ITEM,
      showEdit: SHOW_EDIT,
      showDelete: SHOW_DELETE,
      isActive: ISACTIVE,
    };

    const result = await con.execute(insertQuery, bindParams);

    await con.commit();
    await con.close();
    return result;
  } catch (err) {
    console.error(err);
  }
}

async function updateScreen({
  id,
  menuId,
  url,
  name,
  orderNo,
  controller,
  isVisible,
  searchOnLoad,
  showNewItem,
  showEdit,
  showDelete,
  isActive,
}) {
  let con;
  try {
    con = await oracledb.getConnection(dbCon);

    const updateQuery = `UPDATE CODEGEN.CD_SCREEN SET AD= '${name}', MENU_ID=${menuId}, URL='${url}', SIRA_NO=${orderNo}, CONTROLLER='${controller}', GORUNSUN_MU=${isVisible}, SEARCH_ON_LOAD=${searchOnLoad}, SHOW_NEW_ITEM=${showNewItem}, SHOW_EDIT=${showEdit}, SHOW_DELETE=${showDelete}, ISACTIVE=${isActive} WHERE ID=${id}`;

    const result = await con.execute(updateQuery);
    await con.commit();
    await con.close();
    return result;
  } catch (err) {
    console.error(err);
  }
}
async function deleteScreen({ id }) {
  let con;
  try {
    con = await oracledb.getConnection(dbCon);

    const deleteQuery = `DELETE FROM CODEGEN.CD_SCREEN WHERE ID= ${id}`;
    const result = await con.execute(deleteQuery);
    await con.commit();
    await con.close();
    return result;
  } catch (err) {
    console.error(err);
  }
}
async function getColLayout() {
  let con;
  try {
    con = await oracledb.getConnection(dbCon);
    const query = `SELECT * FROM CODEGEN.CD_ENUM
    WHERE AD LIKE '%ColumnLayout%'`;
    const colLays = await con.execute(query);

    await con.close();
    return Object.values(colLays.rows);
  } catch (err) {
    console.error(err);
  }
}
module.exports = {
  getScreens,
  getScreensWithMenu,
  createScreen,
  updateScreen,
  deleteScreen,
  getColLayout,
};
