const CreateSchemaDetail = (pageName, fields, screenInfo, tools) => {
  const indexModel = [];

  for (let i = 0; i < fields.length; i++) {
    const obj = {};

    obj[fields[i].dataIndex] = `z.${convertType(fields[i].dataType)}()${
      fields[i].dataType === 2 ? `.max(${fields[i].fieldLength}).min(1)` : ""
    }`;
    indexModel.push(obj);
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
export default CreateSchemaDetail;
