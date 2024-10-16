const CreateDefaultValues = (pageName, allFields, screenInfo, tools) => {
  const indexModel = [];

  for (let i = 0; i < allFields.length; i++) {
    const obj = {};
    if (
      allFields[i].visibleScreens &&
      allFields[i].visibleScreens.includes("Filter Page")
    ) {
      obj[allFields[i].dataIndex] =
        allFields[i].dataType === 1
          ? "null"
          : allFields[i].dataType === 3
          ? "false"
          : ' "" ';
      indexModel.push(obj);
    }
  }

  const template = `Code template with necessary modificaitons.`;
  return template;
};

export default CreateDefaultValues;
