const CreateDefaultaluesDetail = (pageName, fields, screenInfo, tools) => {
  const indexModel = [];

  for (let i = 0; i < fields.length; i++) {
    const [key, value] = Object.entries(fields[i]);
    const obj = {};
    obj[fields[i].dataIndex] =
      fields[i].dataType === 1
        ? "null"
        : fields[i].dataType === 3
        ? "false"
        : ' "" ';
    indexModel.push(obj);
  }

  const template = `Code template with necessary modificaitons.`;
  return template;
};
export default CreateDefaultaluesDetail;
