const CreateContentPage = (pageName, fields, screenInfo, tools) => {
  let i = 0;
  function convertType(value) {
    if (value.componentId != -1) {
      switch (value.componentId) {
        case 4:
          return ` <${value.dataIndex
            .replace(/\s/g, "")
            .replace(/Id/, "")
            .replace(
              value.dataIndex.substr(0, 1),
              value.dataIndex.substr(0, 1).toUpperCase()
            )}Select
          label={${value.dataIndex.replace(/\s/g, "")}
          name="${value.dataIndex.replace(/\s/g, "")}"
          disabled={${value.disabled ? "true" : "false"}}
          ${
            value.warningMsg
              ? `hasFeedback
          help="${value.warningMsg}"`
              : ""
          }/>`;
        case 5:
          return ` <${value.dataIndex
            .replace(/\s/g, "")
            .replace(/Id/, "")
            .replace(
              value.dataIndex.substr(0, 1),
              value.dataIndex.substr(0, 1).toUpperCase()
            )}Find
            label={${value.dataIndex.replace(/\s/g, "")}
            name="${value.dataIndex.replace(/\s/g, "")}"
            disabled={${value.disabled ? "true" : "false"}}
            ${
              value.warningMsg
                ? `hasFeedback
            help="${value.warningMsg}"`
                : ""
            }/>`;
        case 6:
          return ` <${value.dataIndex
            .replace(/\s/g, "")
            .replace(/Id/, "")
            .replace(
              value.dataIndex.substr(0, 1),
              value.dataIndex.substr(0, 1).toUpperCase()
            )}Select
              label={${value.dataIndex.replace(/\s/g, "")}
              name="${value.dataIndex.replace(/\s/g, "")}"
              disabled={${value.disabled ? "true" : "false"}}
              ${
                value.warningMsg
                  ? `hasFeedback
              help="${value.warningMsg}"`
                  : ""
              }/>`;
        default:
          return null;
      }
    } else {
      switch (value.dataType) {
        case 2:
          return ` <Input
        label={${value.dataIndex.replace(/\s/g, "")}
        name="${value.dataIndex.replace(/\s/g, "")}"
        disabled={${value.disabled ? "true" : "false"}}
        ${
          value.warningMsg
            ? `hasFeedback
        help="${value.warningMsg}"`
            : ""
        }/>`;

        case 1:
          return ` <NumberInput
        label={${value.dataIndex.replace(/\s/g, "")}
        name="${value.dataIndex.replace(/\s/g, "")}"
        disabled={${value.disabled ? "true" : "false"}} ${
            value.warningMsg
              ? `hasFeedback
        help="${value.warningMsg}"`
              : ""
          }/>`;

        case 3:
          return ` <DecisionSelect
          name="${value.dataIndex.replace(/\s/g, "")}"
          label={t('common:${value.dataIndex.replace(/\s/g, "")}')}
          disabled={${value.disabled ? "true" : "false"}} ${
            value.warningMsg
              ? `hasFeedback
          help="${value.warningMsg}"`
              : ""
          }/>`;

        case 15:
          return ` <DatePicker
        label={${value.dataIndex.replace(/\s/g, "")}
        name="${value.dataIndex.replace(/\s/g, "")}"
        style={{ width: '100%' }}
        disabled={${value.disabled ? "true" : "false"}} ${
            value.warningMsg
              ? `hasFeedback
        help="${value.warningMsg}"`
              : ""
          }/>`;

        default:
          return;
      }
    }
  }
  let gridColumns = "";
  for (const [key, value] of Object.entries(fields)) {
    if (value.visibleScreens.includes("Content Page")) {
      gridColumns = gridColumns.concat(`
        <Col {...${value.colLayName}} >
        ${convertType(value)}
        </Col>`);
    }
  }

  const template = `Code template with necessary modificaitons.`;
  return template;
};

export default CreateContentPage;
