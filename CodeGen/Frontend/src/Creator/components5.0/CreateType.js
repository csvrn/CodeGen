const CreateType = (pageName, allFields, screenInfo, tools) => {
  let index;
  const indexModel = [];

  for (let i = 0; i < allFields.length; i++) {
    const obj = {};

    obj[allFields[i].dataIndex] = convertType(allFields[i].dataType);
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
        return "Date";
      default:
        throw new Error(`Unsupported type: ${value}`);
    }
  }

  index = `Code template with necessary modificaitons.`
    .replace(/\s*}\s*]\s*;/g, ";\n}")
    .replace(/\[\s*{/g, "{");

  return index;
};

export default CreateType;
