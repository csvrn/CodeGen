export const CreateSchema = (pageName, allFields, screenInfo, tools) => {
  const indexModel = [];

  for (let i = 0; i < allFields.length; i++) {
    const obj = {};
    if (allFields[i]?.visibleScreens?.includes("Filter Page")) {
      obj[allFields[i].dataIndex] = `z.${convertType(allFields[i].dataType)}()${
        !allFields[i].isRequired ? ".nullish()" : ""
      }`;
      indexModel.push(obj);
    }
  }

  function convertType(value) {
    switch (value) {
      case 1:
        return "number";
      case 2:
        return "string";
      case 3:
        return "boolean";
      case 15:
        return "date";
      default:
        throw new Error(`Unsupported type: ${value}`);
    }
  }

  const template = `Code template with necessary modificaitons.`;

  return template;
};
export default CreateSchema;
