import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import { Button, Form, Input, Table, Typography, Popconfirm } from "antd";
import axios from "axios";
import { EditableCell } from "./EditableCell";

export const ProjectsPage = () => {
  const { Header } = Layout;
  const [dataSource, setDataSource] = useState([]);
  const [form] = Form.useForm();

  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const [formData, setFormData] = useState({});

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      database: "",
      connectionString: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...dataSource];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setDataSource(newData);
        const res = await updateProject(row);
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

  const onFinish = async (values) => {
    const allProjects = await fetchProjects();
    allProjects[Object.entries(allProjects).length] = {
      AD: values.projectName,
      DATABASE_NAME: values.dbName,
      CONNECTION_STRING: values.conStr,
    };
    updateDataSource(allProjects);

    try {
      const res = await axios.post("http://localhost:3001/createProject", {
        data: {
          AD: values.projectName,
          DATABASE_NAME: values.dbName,
          CONNECTION_STRING: values.conStr,
        },
      });
      console.log("Data written to file successfully");
      form.resetFields();
      return res;
    } catch (error) {
      console.error("Error writing data to file:", error);
    }
  };

  const cols = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      editable: true,
      fixed: "left",
    },
    {
      title: "Database",
      dataIndex: "database",
      key: "database",
      editable: true,
    },
    {
      title: "Connection String",
      dataIndex: "connectionString",
      key: "connectionString",
      editable: true,
    },
    {
      title: "Edit",
      dataIndex: "operation",
      width: "10%",
      fixed: "right",

      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Are you sure to cancel?" onConfirm={cancel}>
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
      width: "5%",
      fixed: "right",

      render: (_, record) => {
        return (
          <Typography.Link>
            <Popconfirm
              title="Are you sure to delete?"
              onConfirm={() => deleteRecord(record)}
            >
              Delete
            </Popconfirm>
          </Typography.Link>
        );
      },
    },
  ];
  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:3001/getProjects");
      console.log("Read data successfully");

      return res.data;
    } catch (error) {
      console.error("Error reading data from file:", error);
    }
  };
  const updateDataSource = (p) => {
    setDataSource((prev) => [
      ...prev,
      {
        key: p.AD,
        name: p.AD,
        database: p.DATABASE_NAME,
        connectionString: p.CONNECTION_STRING,
      },
    ]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchProjects();
        const source = [];
        for (const i in Object.values(res)) {
          const p = res[i];
          source.push({
            key: p.AD,
            name: p.AD,
            database: p.DATABASE_NAME,
            connectionString: p.CONNECTION_STRING,
          });
        }

        setDataSource(source);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const updateProject = async (project) => {
    try {
      const res = await axios.post("http://localhost:3001/updateProject", {
        data: project,
      });
      console.log("Data written to file successfully");
      return res;
    } catch (error) {
      console.error("Error writing data to file:", error);
    }
  };
  const deleteRecordByKey = async (project) => {
    try {
      const res = await axios.post("http://localhost:3001/deleteProject", {
        data: project,
      });
      console.log("Deleted project successfully");
      return res;
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };
  const onClick = async (values) => {
    const project = {
      AD: formData.projectName,
      DATABASE_NAME: formData.dbName,
      CONNECTION_STRING: formData.conStr,
    };
    updateDataSource(project);

    try {
      const res = await axios.post("http://localhost:3001/createProject", {
        data: {
          AD: formData.projectName,
          DATABASE_NAME: formData.dbName,
          CONNECTION_STRING: formData.conStr,
        },
      });
      console.log("Data written to file successfully", res);
      form.resetFields();
      return res;
    } catch (error) {
      console.error("Error writing data to file:", error);
    }
  };

  const mergedColumns = cols.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <div
      style={{
        minHeight: "80vh",
        minWidth: "60vw",
        marginLeft: "5%",
        marginRight: "5%",

        textAlign: "center",
        minHeight: 120,
        lineHeight: "120px",
        color: "#fff",
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
        Projeler
      </Header>
      <Form
        form={form}
        labelCol={{ span: 9 }}
        wrapperCol={{ span: 6 }}
        onFinish={onFinish}
      >
        <Form.Item
          name="projectName"
          label="Yeni Proje Adı"
          style={{ marginTop: "15px" }}
        >
          <Input
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, projectName: e.target.value }))
            }
          />
        </Form.Item>
        <Form.Item
          name="dbName"
          label="Database Adı"
          style={{ marginTop: "15px" }}
        >
          <Input
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, dbName: e.target.value }))
            }
          />
        </Form.Item>
        <Form.Item
          name="conStr"
          label="Connection String"
          style={{ marginTop: "15px" }}
        >
          <Input
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, conStr: e.target.value }))
            }
          />
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.type !== currentValues.type
          }
        >
          {({ getFieldValue }) =>
            getFieldValue("alan") === "select" ? (
              <Form.Item
                name="newSelect"
                label="New Field"
                rules={[
                  {
                    required: true,
                  },
                ]}
                style={{ marginBottom: "8px" }}
              >
                <Input />
              </Form.Item>
            ) : null
          }
        </Form.Item>
        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Button type="primary" htmlType="submit" onClick={onClick}>
            Create Project
          </Button>
        </Form.Item>
        <div style={{ margin: "0 20px" }}>
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
