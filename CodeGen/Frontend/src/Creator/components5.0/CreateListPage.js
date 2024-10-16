import { DatePicker } from "antd";
import { useEffect } from "react";

const CreateListPage = (pageName, fields, screenInfo, tools) => {
  const imports = `Code template with necessary modificaitons.`;

  let gridColumns = "";
  for (let i = 0; i < fields.length; i++) {
    gridColumns = gridColumns.concat(`{
      title: ${fields[i].dataIndex},
      dataIndex: '${fields[i].dataIndex}',${
      fields[i].dataIndex === "isActive"
        ? ""
        : `width: ${
            fields[i].dataIndex.columnWidth
              ? fields[i].dataIndex.columnWidth
              : '"150px"'
          },`
    }
    ${fields[i].visibleScreens.includes("List Page") ? "" : "visible: false,"}
    ${
      fields[i].dataType === 15
        ? `render(text) {
      return <DateFormat date={text} enableTime />;
    },`
        : ""
    }
  },`);
  }

  const template = `Code template with necessary modificaitons.`;

  return template;
};
export default CreateListPage;
