import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Layout, Row, Col } from "antd";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Select,
  Table,
  Typography,
  Popconfirm,
} from "antd";
import axios, { all } from "axios";
import { EditableCell } from "./EditableCell";
import Creator from "./Creator/Creator";

export const ScreenSpecificPage = () => {
  let { screenName } = useParams();

  const { Header } = Layout;
  const [dataSource, setDataSource] = useState([]);
  const [screenId, setScreenId] = useState(0);
  const [form] = Form.useForm();
  const url = window.location.href;
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.dataIndex === editingKey;
  const [formData, setFormData] = useState({});
  const getDataModel = (item) => {
    return {
      key: item.ID,
      id: item.ID,
      screenId: item.SCREEN_ID,
      fieldName: item.FIELD_NAME,
      dataType: item.DATA_TYPE,

      componentId: item.COMPONENT_ID,
      fieldLength: item.FIELD_LENGTH,
      isRequired: item.IS_REQUIRED,
      disabled: item.DISABLED,
      visibleScreens: item.VISIBLE_SCREENS,
      warningMsg: item.WARNING_MESSAGE,
      columnLayout: item.COLUMN_LAYOUT,
      columnLayoutName: item.COL_LAY,
      dataIndex: item.DATAINDEX,
      columnWidth: item.COLUMN_WIDTH,
    };
  };
  const getFormModel = () => {
    return {
      ID: formData.ID,
      SCREEN_ID: screenId,
      FIELD_NAME: formData.newName,
      DATA_TYPE: formData.newDataType,
      COMPONENT_ID: formData.newComponentId,
      FIELD_LENGTH: formData.newLength ? formData.newLength : 0,
      IS_REQUIRED: formData.newIsRequired ? "1" : "0",
      DISABLED: formData.newDisabled ? "1" : "0",
      VISIBLE_SCREENS: formData.newVisibleScreens,
      WARNING_MESSAGE: formData.newWarningMsg,
      COLUMN_LAYOUT: formData.newColLayout,
      COLUMN_LAYOUT_NAME: formData.newColLayoutName,
      COLUMN_WIDTH: formData.newColumnWidth,
      DATAINDEX: formData.newDataIndex,
    };
  };

  const fetchFields = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/getFields/${screenName}`
      );
      setScreenId(res.data.screenId);
      return res.data;
    } catch (error) {
      console.error("Error reading data from file:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchFields();
        const source = [];
        for (const i in Object.values(res.rows)) {
          const item = res.rows[i];

          const dataModel = getDataModel(item);
          dataModel["dataType"] =
            item.DATA_TYPE === 1
              ? "Number"
              : item.DATA_TYPE === 2
              ? "String"
              : item.DATA_TYPE === 3
              ? "Boolean"
              : "Date";

          source.push(dataModel);
        }

        setDataSource(source);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const updateDataSource = (item) => {
    const dataModel = getDataModel(item);
    dataModel["dataType"] =
      item.DATA_TYPE === 1
        ? "Number"
        : item.DATA_TYPE === 2
        ? "String"
        : item.DATA_TYPE === 3
        ? "Boolean"
        : "Date";

    setDataSource((prev) => [...prev, getDataModel(item)]);
  };

  const onFinish = async (values) => {
    const allFields = await fetchFields();
    const field = getDataModel(values);

    allFields[Object.entries(allFields).length] = field;
    updateDataSource(allFields);

    try {
      const res = await axios.post("http://localhost:3001/createField", {
        data: field,
      });
      console.log("Data written to file successfully");
      form.resetFields();
      return res;
    } catch (error) {
      console.error("Error writing data to file:", error);
    }
  };
  const deleteRecordByKey = async (field) => {
    try {
      const res = await axios.post("http://localhost:3001/deleteField", {
        data: field,
      });
      console.log("Deleted field successfully");
      return res;
    } catch (error) {
      console.error("Error deleting field: ", error);
    }
  };
  const onClick = async (values) => {
    const field = getFormModel();
    updateDataSource(field);

    try {
      const res = await axios.post("http://localhost:3001/createField", {
        data: field,
      });
      console.log("Data written to file successfully", res);
      form.resetFields();
      setFormData({});
      return res;
    } catch (error) {
      console.error("Error writing data to file:", error);
    }
  };
  const deleteRecord = async (record) => {
    try {
      const newData = [...dataSource];
      const index = newData.findIndex((item) => record.key === item.key);
      newData.splice(index, 1);

      setDataSource(newData);
      const res = await deleteRecordByKey(record);
    } catch (errInfo) {
      console.log("Delete Failed:", errInfo);
    }
  };

  const updateField = async (field) => {
    try {
      const res = await axios.post("http://localhost:3001/updateField", {
        data: field,
      });
      console.log("Data written to file successfully");
      return res;
    } catch (error) {
      console.error("Error writing data to file:", error);
    }
  };
  const cancel = () => {
    setEditingKey("");
  };
  const edit = (record) => {
    form.setFieldsValue({
      screenId: "",
      fieldName: "",
      dataType: "",
      componentId: "",
      fieldLength: "",
      isRequired: "",
      disabled: "",
      visibleScreens: "",
      warningMsg: "",
      columnWidth: "",
      columnLayout: "",
      columnLayoutName: "",
      dataIndex: "",
      ...record,
    });
    setEditingKey(record.dataIndex);
  };
  const save = async (record) => {
    try {
      const f = form.getFieldsValue();
      const row = await form.validateFields();
      const newData = [...dataSource];
      const index = newData.findIndex((item) => record.key === item.key);

      if (index > -1) {
        const item = newData[index];
        const convertedDataType =
          row.dataType === "Number"
            ? 1
            : row.dataType === "String"
            ? 2
            : row.dataType === "Boolean"
            ? 3
            : 15;

        const convertedVisScreens = row.visibleScreens?.toString();
        newData.splice(index, 1, {
          ...item,
          ...row,
          visibleScreens: convertedVisScreens,
        });

        setDataSource(newData);
        const res = await updateField({
          ...record,
          ...row,
          dataType: convertedDataType,
          visibleScreens: row.visibleScreens?.toString(),
          id: record.id,
        });

        setEditingKey("");
      } else {
        newData.push(row);
        setDataSource(newData);

        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const cols = [
    {
      title: "Name",
      dataIndex: "fieldName",
      inputType: "string",
      key: "fieldName",
      editable: true,
      width: "120px",
      fixed: "left",
    },

    {
      title: "Data Index",
      dataIndex: "dataIndex",
      inputType: "number",
      key: "dataIndex",
      editable: true,
      width: "120px",
    },
    {
      title: "Data Type",
      inputType: "select",
      dataIndex: "dataType",
      key: "dataType",
      editable: true,
      width: "150px",
    },

    {
      title: "Component Id",
      dataIndex: "componentId",
      inputType: "select",
      key: "componentId",
      editable: true,
      width: "170px",
    },
    {
      title: "Field Length",
      dataIndex: "fieldLength",
      inputType: "number",
      key: "fieldLength",
      editable: true,
      width: "120px",
    },
    {
      title: "Is Required",
      dataIndex: "isRequired",
      inputType: "boolean",
      key: "isRequired",
      editable: true,
      width: "100px",
      render: (text) => {
        return text ? "Yes" : "No";
      },
    },
    {
      title: "Disabled",
      dataIndex: "disabled",
      inputType: "boolean",
      key: "disabled",
      editable: true,
      width: "100px",
      render: (text) => {
        return text ? "Yes" : "No";
      },
    },
    {
      title: "Visible Screens",
      dataIndex: "visibleScreens",
      inputType: "combobox",
      key: "visibleScreens",
      editable: true,
      width: "180px",
    },
    {
      title: "Warning Message",
      dataIndex: "warningMsg",
      inputType: "string",
      key: "warningMsg",
      editable: true,
      width: "250px",
    },
    {
      title: "Column Layout",
      dataIndex: "columnLayout",
      key: "columnLayout",
      editable: true,
      width: "120px",
      inputType: "colLayout",
      render: (_, record) => {
        return record.columnLayoutName;
      },
    },
    {
      title: "Edit",
      dataIndex: "operation",
      width: "120px",
      fixed: "right",

      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
    {
      title: "Delete",
      dataIndex: "delete",
      width: "80px",
      fixed: "right",

      render: (_, record) => {
        return (
          <Typography.Link>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => deleteRecord(record)}
            >
              Delete
            </Popconfirm>
          </Typography.Link>
        );
      },
    },
  ];
  const mergedColumns = cols.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        required: col.required ? col.required : 0,
      }),
    };
  });

  return (
    <div
      style={{
        marginLeft: "5%",
        marginRight: "5%",

        minHeight: 120,
        lineHeight: "120px",
        color: "#fff",
        width: "1000px",
        backgroundColor: "#fff",
      }}
    >
      <Header
        style={{
          color: "black",
          height: 64,
          paddingInline: 48,
          padding: "5px 10px",
          lineHeight: "64px",
          backgroundColor: "#fff",
          textAlign: "left",
          fontSize: "20px",
        }}
      >
        {screenName}
      </Header>
      <Form
        form={form}
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 5 }}
        onFinish={onFinish}
      >
        <Row gutter={14}>
          <Col span={9}>
            <Form.Item
              name="newName"
              label="Yeni Alan Adı"
              style={{ marginTop: "15px" }}
            >
              <Input
                style={{ width: "200%" }}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    newName: e.target.value,
                  }))
                }
              />
            </Form.Item>

            <Form.Item
              name="newDataIndex"
              label="Data Index"
              style={{ marginTop: "15px" }}
            >
              <Input
                style={{ width: "200%" }}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    newDataIndex: e.target.value,
                  }))
                }
              />
            </Form.Item>
            <Form.Item
              name="newDataType"
              label="Data Type"
              style={{ marginTop: "15px" }}
            >
              <Select
                style={{ width: "200%" }}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    newDataType: value,
                  }))
                }
                placeholder="Select a Data Type"
              >
                <Select.Option value={1}>Number</Select.Option>
                <Select.Option value={2}>String</Select.Option>
                <Select.Option value={3}>Boolean</Select.Option>
                <Select.Option value={15}>Date</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={7}>
            <Form.Item
              name="newComponentId"
              label="Component Id"
              style={{
                marginTop: "15px",

                textAlign: "left",
              }}
            >
              <Select
                style={{ width: "200%" }}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    newComponentId: value,
                  }))
                }
                placeholder="None"
              >
                <Select.Option value={4}>Select</Select.Option>
                <Select.Option value={5}>AutoComplete</Select.Option>
                <Select.Option value={6}>ComboBox</Select.Option>
              </Select>
            </Form.Item>

            {(formData?.newDataType === 1 || formData?.newDataType === 2) && (
              <Form.Item
                name="newLength"
                label="Length"
                style={{ marginTop: "15px" }}
              >
                <Input
                  style={{ width: "200%" }}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      newLength: e.target.value,
                    }))
                  }
                />
              </Form.Item>
            )}
            <Form.Item
              name="newVisibleScreens"
              label="Visible Screens"
              style={{ marginTop: "15px" }}
            >
              <Select
                mode="multiple"
                style={{ width: "200%" }}
                placeholder="None"
                onChange={(selectedValues) =>
                  setFormData((prev) => ({
                    ...prev,
                    newVisibleScreens: selectedValues.join(","),
                  }))
                }
              >
                <Select.Option value="List Page">List Page</Select.Option>
                <Select.Option value="Content Page">Content Page</Select.Option>
                <Select.Option value="Filter Page">Filter Page</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="newIsRequired"
              label="Is Required"
              style={{
                marginTop: "15px",
              }}
            >
              <Checkbox
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    newIsRequired: e.target.checked,
                  }))
                }
              />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              name="newWarningMsg"
              label="Warning Msg"
              style={{ marginTop: "15px" }}
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input
                style={{ width: "200%" }}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    newWarningMsg: e.target.value,
                  }))
                }
              />
            </Form.Item>
            <Form.Item
              name="newColLayout"
              label="Column Layout"
              style={{ marginTop: "15px" }}
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Select
                style={{ width: "200%" }}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    newColLayout: value,
                  }))
                }
                placeholder="None"
              >
                <Select.Option value="7">Two Column Layout</Select.Option>
                <Select.Option value="8">Three Column Layout</Select.Option>
                <Select.Option value="9">Four Column Layout</Select.Option>
                <Select.Option value="10">Five Column Layout</Select.Option>
                <Select.Option value="11">Six Column Layout</Select.Option>
                <Select.Option value="12">Eight Column Layout</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="newDisabled"
              label="Disabled"
              style={{
                marginTop: "15px",
              }}
            >
              <Checkbox
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    newDisabled: e.target.checked,
                  }))
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={onClick}>
              Create Field
            </Button>
          </Form.Item>
          <div style={{ marginLeft: "50px" }}>
            <Creator
              pageName={screenName}
              screenId={screenName}
              controller="System"
            />
          </div>
        </div>
        <div style={{ margin: "0 10px" }}>
          <Form form={form} component={false}>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={dataSource}
              columns={mergedColumns}
              rowClassName="editable-row"
              pagination={{
                onChange: cancel,
              }}
              scroll={{ x: 1000, y: 500 }}
            />
          </Form>
        </div>
      </Form>
    </div>
  );
};
