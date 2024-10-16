const express = require("express");
const cors = require("cors");
const app = express();

const oracledb = require("oracledb");
const { getScreens } = require("./screenApi");

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
async function getMenus() {
  let con;
  try {
    con = await oracledb.getConnection(dbCon);

    const menus = await con.execute(`SELECT * FROM CODEGEN.CD_MENU`);

    const screens = await getScreens();
    const nestedMenus = buildNestedMenus(screens, Object.values(menus.rows));
    await con.close();
    return nestedMenus;
  } catch (err) {
    console.error(err);
  }
}

async function getMenusWithName() {
  let con;
  try {
    con = await oracledb.getConnection(dbCon);

    const joinQuery = await con.execute(`
    SELECT o.*, p.AD as PROJECT_NAME, m.AD as MENU_NAME
    FROM CODEGEN.CD_MENU o
    LEFT JOIN CODEGEN.CD_MENU m ON o.UST_MENU_ID = m.ID
    LEFT JOIN CODEGEN.CD_PROJECT p ON o.PROJE_ID = p.ID
    `);

    if (!joinQuery.rows) {
      console.error("No rows returned from query");
      return [];
    }

    const processedRows = joinQuery.rows.map((row) => {
      return {
        ...row,
        PROJECT_NAME: row.PROJECT_NAME || "-",
        MENU_NAME: row.MENU_NAME || "-",
      };
    });

    return processedRows;
  } catch (err) {
    console.error(err);
    return [];
  } finally {
    if (con) {
      try {
        await con.close();
      } catch (err) {
        console.error("Error closing the connection:", err);
      }
    }
  }
}
async function getFlatMenus() {
  let con;
  try {
    con = await oracledb.getConnection(dbCon);

    const menus = await con.execute(`SELECT * FROM CODEGEN.CD_MENU`);

    await con.close();
    return Object.values(menus.rows);
  } catch (err) {
    console.error(err);
  }
}

function buildNestedMenus(screens, items, UST_MENU_ID = 0) {
  const nestedMenus = [];
  items
    .filter((item) => item.UST_MENU_ID === UST_MENU_ID)
    .forEach((item) => {
      nestedMenus.push({
        id: item.ID,
        name: item.AD,
        projectId: item.PROJE_ID,
        upperMenuId: item.UST_MENU_ID,
        url: item.URL,
        orderNo: item.SIRA_NO,
        isVisible: item.GORUNSUN_MU,
        icon: item.ICON,
        isActive: item.ISACTIVE,
        screens: screens.filter((x) => x.MENU_ID === item.ID),
        subMenus: buildNestedMenus(screens, items, item.ID),
      });
    });
  return nestedMenus;
}
async function createMenu({
  AD,
  PROJE_ID,
  UST_MENU_ID,
  URL,
  SIRA_NO,
  GORUNSUN_MU = 1,
  ICON,
  ISACTIVE = 1,
}) {
  let con;
  try {
    con = await oracledb.getConnection(dbCon);
    const insertQuery = `INSERT INTO CODEGEN.CD_MENU (AD, PROJE_ID, UST_MENU_ID, URL, SIRA_NO, GORUNSUN_MU, ICON, ISACTIVE)
        VALUES (:name, :projectId, :upperMenuId, :url, :orderNo, :isVisible, :icon, :isActive)
      `;
    const bindParams = {
      name: AD,
      projectId: PROJE_ID,
      upperMenuId: UST_MENU_ID,
      url: URL,
      orderNo: SIRA_NO,
      isVisible: GORUNSUN_MU,
      icon: ICON,
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
async function updateMenu({
  id,
  name,
  projectId,
  upperMenuId,
  url,
  orderNo,
  isVisible,
  isActive,
}) {
  let con;
  try {
    con = await oracledb.getConnection(dbCon);

    const updateQuery = `UPDATE CODEGEN.CD_MENU SET AD= '${name}', PROJE_ID =${projectId} , UST_MENU_ID=${upperMenuId}, URL='${url}', SIRA_NO=${orderNo}, GORUNSUN_MU=${isVisible}, ISACTIVE=${isActive} WHERE ID=${id}`;

    const result = await con.execute(updateQuery);
    await con.commit();
    await con.close();
    return result;
  } catch (err) {
    console.error(err);
  }
}

async function deleteMenu({ id }) {
  let con;
  try {
    con = await oracledb.getConnection(dbCon);

    const deleteQuery = `DELETE FROM CODEGEN.CD_MENU WHERE ID= '${id}'`;
    const result = await con.execute(deleteQuery);
    await con.commit();
    await con.close();
    return result;
  } catch (err) {
    console.error(err);
  }
}
module.exports = {
  getMenus,
  getMenusWithName,
  getFlatMenus,
  buildNestedMenus,
  createMenu,
  updateMenu,
  deleteMenu,
};
