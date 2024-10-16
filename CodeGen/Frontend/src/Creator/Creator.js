import React, { useState, useEffect } from "react";
import axios from "axios";
import CreateListPage from "./components5.0/CreateListPage";
import CreateDetailPage from "./components5.0/CreateDetailPage";
import CreateGetByIdQuery from "./components5.0/CreateGetByIdQuery";
import CreateSaveMutation from "./components5.0/CreateSaveMutation";
import CreateDeleteMutation from "./components5.0/CreateDeleteMutation";
import CreateFilter from "./components5.0/CreateFilter";
import CreateContentPage from "./components5.0/CreateContentPage";
import CreateAutoComplete from "./components5.0/CreateAutoComplete";
import CreateSelect from "./components5.0/CreateSelect";
import CreateSelectQuery from "./components5.0/CreateSelectQuery";

import { Button } from "antd";
import CreateType from "./components5.0/CreateType";
import CreateSchema from "./components5.0/CreateSchema";
import CreateDefaultValues from "./components5.0/CreateDefaultValues";
import CreateSchemaDetail from "./components5.0/CreateSchemaDetail";
import CreateDefaultaluesDetail from "./components5.0/CreateDefaultValuesDetail";
import CreateFormLayout from "./components5.0/CreateFormLayout";
import CreateLazyQuery from "./components5.0/CreateLazyQuery";
import CreateStatelessQuery from "./components5.0/CreateStatelessQuery";

const Creator = ({ pageName }) => {
  const [component, setComponent] = useState([]);

  const tools = {
    listeTipiId: ["select", "listeTipi"],
    ekstraTipId: ["autoComplete", "ekstraTip"],
  };

  const getDataModel = (item) => {
    return {
      key: item.ID,
      id: item.ID,
      screenId: item.SCREEN_ID,
      fieldName: item.FIELD_NAME,
      dataType: item.DATA_TYPE,
      enumTypeName: item.ENUM_TYPE_NAME,
      componentId: item.COMPONENT_ID,
      fieldLength: item.FIELD_LENGTH,
      isRequired: item.IS_REQUIRED,
      disabled: item.DISABLED,
      visibleScreens: item.VISIBLE_SCREENS,
      warningMsg: item.WARNING_MESSAGE,
      columnLayout: item.COLUMN_LAYOUT,
      colLayName: item.COL_LAY,
      dataIndex: item.DATAINDEX,
      columnWidth: item.COLUMN_WIDTH,
      isActive: item.ISACTIVE,
    };
  };
  const getScreenModel = (item) => {
    return {
      key: item.ID,
      id: item.ID,
      name: item.AD,
      menuId: item.MENU_ID,
      url: item.URL,
      searchOnLoad: item.SEARCH_ON_LOAD,
      showNewItem: item.SHOW_NEW_ITEM,
      showEdit: item.SHOW_EDIT,
      showDelete: item.SHOW_DELETE,
      orderNo: item.SIRA_NO,
      controller: item.CONTROLLER,
      isVisible: item.GORUNSUN_MU,
      isActive: item.ISACTIVE,
    };
  };

  const fetchIndex = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/creator/getFields/${pageName}`
      );
      console.log("Read data successfully");
      const formattedFields = [];
      for (const [key, val] of Object.entries(res.data)) {
        console.log(val);
        formattedFields.push(getDataModel(val));
      }
      return formattedFields;
    } catch (error) {
      console.error("Error reading data from file:", error);
    }
  };
  const fetchScreenInfo = async (screenId) => {
    try {
      const res = await axios.get(
        `http://localhost:3001/getScreenById/${screenId}`
      );
      console.log("Read data successfully");
      const formattedFields = [];
      for (const [key, val] of Object.entries(res.data)) {
        formattedFields.push(getScreenModel(val));
      }
      return formattedFields;
    } catch (error) {
      console.error("Error reading data from file:", error);
    }
  };

  const fetchData = async () => {
    try {
      const fields = await fetchIndex();
      const screen = await fetchScreenInfo(fields[0].screenId);

      return [fields, screen[0]];
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onFinish = async () => {
    const [allFields, screenInfo] = await fetchData();

    const index = CreateType(pageName, allFields, screenInfo, tools);
    const schema = CreateSchema(pageName, allFields, screenInfo, tools);
    const defVals = CreateDefaultValues(pageName, allFields, screenInfo, tools);
    const schemaDetail = CreateSchemaDetail(
      pageName,
      allFields,
      screenInfo,
      tools
    );
    const defValsDetail = CreateDefaultaluesDetail(
      pageName,
      allFields,
      screenInfo,
      tools
    );
    const listPage = CreateListPage(pageName, allFields, screenInfo, tools);
    const filterPage = CreateFilter(pageName, allFields, screenInfo, tools);
    const getQuery = CreateGetByIdQuery(pageName, allFields, screenInfo, tools);
    const getLazyQuery = CreateStatelessQuery(
      pageName,
      allFields,
      screenInfo,
      tools
    );
    const detailPage = CreateDetailPage(pageName, allFields, screenInfo, tools);
    const saveMutation = CreateSaveMutation(
      pageName,
      allFields,
      screenInfo,
      tools
    );
    const deleteMutation = CreateDeleteMutation(
      pageName,
      allFields,
      screenInfo,
      tools
    );
    const contentPage = CreateContentPage(
      pageName,
      allFields,
      screenInfo,
      tools
    );
    const select = CreateSelect(pageName, allFields, screenInfo, tools);

    const selectQuery = CreateSelectQuery(
      pageName,
      allFields,
      screenInfo,
      tools
    );
    const autoComplete = CreateAutoComplete(
      pageName,
      allFields,
      screenInfo,
      tools
    );
    const lazyQuery = CreateLazyQuery(pageName, allFields, screenInfo, tools);
    const formLayout = CreateFormLayout(pageName, allFields, screenInfo, tools);

    const toolPages = [];
    const selectQueries = [];

    const pages = [
      ["types.d.ts", index],
      ["schema.ts", schema],
      ["defaultValues.ts", defVals],
      [`${pageName.replace(/\s/g, "")}sPage.tsx`, listPage],
      [`${pageName.replace(/\s/g, "")}Filter.tsx`, filterPage],

      ["schema.ts", schemaDetail],
      ["defaultValues.ts", defValsDetail],
      [`${pageName.replace(/\s/g, "")}Page.tsx`, detailPage],
      [`${pageName.replace(/\s/g, "")}Content.tsx`, contentPage],

      [`use${pageName.replace(/\s/g, "")}Query.ts`, getQuery],
      [`use${pageName.replace(/\s/g, "")}sLazyQuery.ts`, getLazyQuery],
      [`use${pageName.replace(/\s/g, "")}SaveMutation.ts`, saveMutation],
      [`use${pageName.replace(/\s/g, "")}DeleteMutation.ts`, deleteMutation],

      [`${pageName.replace(/\s/g, "")}Select.tsx`, select],
      [`${pageName.replace(/\s/g, "")}Query.tsx`, selectQuery],

      [`${pageName.replace(/\s/g, "")}Find.tsx`, autoComplete],
      [`${pageName.replace(/\s/g, "")}sLazyQuery.tsx`, lazyQuery],

      ["FormLayouts.ts", formLayout],
      ...toolPages,
      ...selectQueries,
    ];

    setComponent(pages);

    try {
      const res = await axios.post("http://localhost:3001/writeFile", {
        data: pages,
        menuName: pageName.replace(/\s/g, ""),
      });
      console.log("Data written to file successfully");
      return res;
    } catch (error) {
      console.error("Error writing data to file:", error);
    }
  };

  return (
    <div style={{}}>
      <Button type="primary" htmlType="submit" onClick={onFinish}>
        Write to File
      </Button>
    </div>
  );
};

export default Creator;
