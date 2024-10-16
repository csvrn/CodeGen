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

async function getFields(screenName) {
  let con;

  try {
    con = await oracledb.getConnection(dbCon);
    const screenQuery = `
    SELECT *
    FROM CODEGEN.CD_SCREEN
    WHERE AD= '${screenName}'`;

    const screen = await con.execute(screenQuery);

    const joinQuery = `
    SELECT F.*, E.AD AS ENUM_TYPE_NAME
    FROM CODEGEN.CD_FIELD F
    LEFT OUTER JOIN CODEGEN.CD_ENUM E
    ON F.DATA_TYPE=E.ID`;

    const fieldQuery = `
    SELECT *
    FROM CODEGEN.CD_FIELD
    WHERE SCREEN_ID=${screen.rows[0].ID}`;

    const columnQuery = `
    SELECT f.*, e.AD as COL_LAY
    FROM CODEGEN.CD_FIELD f
    LEFT JOIN CODEGEN.CD_ENUM e ON f.COLUMN_LAYOUT= e.ID
    WHERE SCREEN_ID=${screen.rows[0].ID}`;

    const col = await con.execute(columnQuery);

    await con.close();
    return {
      rows: Object.values(col.rows),
      screenId: screen.rows[0].ID,
    };
  } catch (err) {
    console.error(err);
  }
}

async function createField({
  SCREEN_ID,
  FIELD_NAME,
  DATA_TYPE,
  COMPONENT_ID = -1,
  FIELD_LENGTH,
  IS_REQUIRED,
  DISABLED,
  VISIBLE_SCREENS = "-",
  WARNING_MESSAGE,
  COLUMN_LAYOUT,
  DATAINDEX,
  CREATEDUSERID = process.env.USER_ID,
  MODIFIEDBYUSERID = process.env.USER_ID,
}) {
  let con;
  try {
    con = await oracledb.getConnection(dbCon);
    const insertQuery = `INSERT INTO CODEGEN.CD_FIELD (SCREEN_ID, FIELD_NAME, DATA_TYPE, COMPONENT_ID, FIELD_LENGTH, IS_REQUIRED, DISABLED, VISIBLE_SCREENS, WARNING_MESSAGE, COLUMN_LAYOUT, DATAINDEX, CREATEDUSERID, MODIFIEDBYUSERID)
        VALUES (:screenId, :fieldName, :dataType, :componentId, :fieldLength, :isRequired, :disabled, :visibleScreens, :warningMsg, :columnLayout, :dataIndex, :createdUserId, :modifiedUserId)
      `;
    const bindParams = {
      screenId: SCREEN_ID,
      fieldName: FIELD_NAME,
      dataType: DATA_TYPE,
      componentId: COMPONENT_ID,
      fieldLength: FIELD_LENGTH,
      isRequired: IS_REQUIRED,
      disabled: DISABLED,
      visibleScreens: VISIBLE_SCREENS,
      warningMsg: WARNING_MESSAGE,
      columnLayout: COLUMN_LAYOUT,
      dataIndex: DATAINDEX,
      createdUserId: CREATEDUSERID,
      modifiedUserId: MODIFIEDBYUSERID,
    };

    const result = await con.execute(insertQuery, bindParams);

    await con.commit();
    await con.close();
    return result;
  } catch (err) {
    console.error(err);
  }
}

async function updateField({
  id,
  screenId,
  fieldName,
  dataType,
  componentId,
  fieldLength,
  isRequired,
  disabled,
  visibleScreens,
  warningMsg,
  columnLayout,
  dataIndex,
}) {
  let con;
  try {
    con = await oracledb.getConnection(dbCon);

    const updateQuery = `UPDATE CODEGEN.CD_FIELD SET SCREEN_ID= ${screenId}, FIELD_NAME='${fieldName}', DATA_TYPE='${dataType}', COMPONENT_ID=${componentId}, FIELD_LENGTH=${fieldLength}, IS_REQUIRED=${isRequired}, DISABLED=${disabled}, VISIBLE_SCREENS='${
      visibleScreens ? visibleScreens : ""
    }', WARNING_MESSAGE='${
      warningMsg ? warningMsg : ""
    }', COLUMN_LAYOUT=${columnLayout}, DATAINDEX='${dataIndex}' WHERE ID=${id}`;

    const result = await con.execute(updateQuery);
    await con.commit();
    await con.close();
    return result;
  } catch (err) {
    console.error(err);
  }
}
async function deleteField({ dataIndex, screenId }) {
  let con;
  try {
    con = await oracledb.getConnection(dbCon);

    const deleteQuery = `DELETE FROM CODEGEN.CD_FIELD WHERE DATAINDEX= '${dataIndex}' AND SCREEN_ID=${screenId} `;
    const result = await con.execute(deleteQuery);
    await con.commit();
    await con.close();
    return result;
  } catch (err) {
    console.error(err);
  }
}
module.exports = {
  getFields,
  createField,
  updateField,
  deleteField,
};
