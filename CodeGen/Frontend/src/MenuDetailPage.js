import React, { useState, useEffect } from "react";
import { Layout } from "antd";
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
import axios from "axios";
import { EditableCell } from "./EditableCell";
import { useMenus } from "./Context";

export const MenuDetailPage = () => {
  const { Header } = Layout;
  const [dataSource, setDataSource] = useState([]);
  const [form] = Form.useForm();

  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const [formData, setFormData] = useState({});
  const [projects, menus] = useMenus();
  const fetchMenus = async () => {
    try {
      const res = await axios.get("http://localhost:3001/getMenusWithName");
      console.log("Read data successfully");

      return res.data;
    } catch (error) {
      console.error("Error reading data from file:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchMenus();

        const source = [];
        for (const i in Object.values(res)) {
          const item = res[i];
          source.push({
            key: item.ID,
            id: item.ID,
            name: item.AD,
            projectId: item.PROJE_ID,
            projectName: item.PROJECT_NAME,
            upperMenuId: item.UST_MENU_ID,
            upperMenuName: item.MENU_NAME,
            url: item.URL,
            orderNo: item.SIRA_NO,
            isVisible: item.GORUNSUN_MU,
            icon: item.ICON,
            isActive: item.ISACTIVE,
            screens: item.screens,
            subMenus: item.subMenus,
          });
        }

        setDataSource(source);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const updateDataSource = (item) => {
    setDataSource((prev) => [
      ...prev,
      {
        key: item.ID,
        id: item.ID,
        name: item.AD,
        projectId: item.PROJE_ID,
        projectName: item.PROJECT_NAME,
        upperMenuId: item.UST_MENU_ID,
        upperMenuName: item.MENU_NAME,
        url: item.URL,
        orderNo: item.SIRA_NO,
        isVisible: item.GORUNSUN_MU,
        icon: item.ICON,
        isActive: item.ISACTIVE,
        screens: item.screens,
        subMenus: item.subMenus,
      },
    ]);
  };

  const onFinish = async (values) => {
    const allMenus = await fetchMenus();
    const menu = {
      ID: values.ID,
      AD: values.AD,
      PROJE_ID: values.PROJE_ID,
      PROJECT_NAME: values.PROJECT_NAME,
      UST_MENU_ID: values.UST_MENU_ID,
      MENU_NAME: values.MENU_NAME,
      URL: values.URL,
      SIRA_NO: values.SIRA_NO,
      GORUNSUN_MU: values.GORUNSUN_MU,
      ICON: values.ICON,
      ISACTIVE: values.ISACTIVE,
      screens: values.screens,
      subMenus: values.subMenus,
    };

    allMenus[Object.entries(allMenus).length] = menu;
    updateDataSource(allMenus);

    try {
      const res = await axios.post("http://localhost:3001/createMenu", {
        data: menu,
      });
      console.log("Data written to file successfully");
      form.resetFields();
      return res;
    } catch (error) {
      console.error("Error writing data to file:", error);
    }
  };
  const deleteRecordByKey = async (menu) => {
    try {
      const res = await axios.post("http://localhost:3001/deleteMenu", {
        data: menu,
      });
      console.log("Deleted menu successfully");
      return res;
    } catch (error) {
      console.error("Error deleting menu: ", error);
    }
  };
  const onClick = async (values) => {
    const menu = {
      ID: formData.ID,
      AD: formData.newName,
      PROJE_ID: formData.newProjectId,
      UST_MENU_ID: formData.newUpperMenuId,
      URL: formData.newUrl,
      SIRA_NO: formData.newOrderNo,
      GORUNSUN_MU: formData.newIsVisible ? "1" : "0",
      ICON: formData.newIcon,
      ISACTIVE: formData.newIsActive,
      screens: formData.screens,
      subMenus: formData.subMenus,
    };

    updateDataSource(menu);

    try {
      const res = await axios.post("http://localhost:3001/createMenu", {
        data: {
          ID: formData.ID,
          AD: formData.newName,
          PROJE_ID: formData.newProjectId,
          UST_MENU_ID: formData.newUpperMenuId,
          URL: formData.newUrl,
          SIRA_NO: formData.newOrderNo,
          GORUNSUN_MU: formData.newIsVisible ? "1" : "0",
          ICON: formData.newIcon,
          ISACTIVE: formData.newIsActive,
          screens: formData.screens,
          subMenus: formData.subMenus,
        },
      });
      console.log("Data written to file successfully", res);
      form.resetFields();
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
  const updateMenu = async (menu) => {
    try {
      const res = await axios.post("http://localhost:3001/updateMenu", {
        data: menu,
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
      name: "",
      projectId: "",
      projectName: "",
      upperMenuId: "",
      upperMenuName: "",
      url: "",
      orderNo: "",
      isVisible: "",
      icon: "",
      isActive: "",
      screens: "",
      subMenus: "",
      ...record,
    });
    console.log("supposed to be key: ", record);
    setEditingKey(record.key);
  };
  const save = async (record) => {
    try {
      const row = await form.validateFields();
      const newData = [...dataSource];
      const index = newData.findIndex((item) => record.key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        setDataSource(newData);
        const res = await updateMenu({ ...record, ...row });
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
      dataIndex: "name",
      key: "name",
      editable: true,
      fixed: "left",
    },
    {
      title: "Project Id",
      dataIndex: "projectId",
      key: "projectId",
      editable: true,
      inputType: "project",
      render: (_, record) => {
        return record.projectName;
      },
    },
    {
      title: "Upper Menu Id",
      dataIndex: "upperMenuId",
      key: "upperMenuId",
      editable: true,
      inputType: "menu",
      render: (_, record) => {
        return record.upperMenuName;
      },
    },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
      editable: true,
    },
    {
      title: "Order No",
      dataIndex: "orderNo",
      key: "orderNo",
      editable: true,
    },
    {
      title: "Is Visible",
      dataIndex: "isVisible",
      key: "isVisible",
      editable: true,
      inputType: "boolean",
      render: (text) => {
        return text ? "Yes" : "No";
      },
    },
    {
      title: "icon",
      dataIndex: "icon",
      key: "icon",
      editable: false,
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
      width: "5%",
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
        Menüler
      </Header>
      <Form
        form={form}
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 6 }}
        onFinish={onFinish}
      >
        <div
          style={{
            display: "flex",
            gridTemplateColumns: "1fr 1fr",
            gap: "0",
          }}
        >
          <div style={{ width: "100%" }}>
            <Form.Item
              name="newName"
              label="Yeni Menü Adı"
              style={{ marginTop: "15px" }}
            >
              <Input
                style={{ width: "200%" }}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, newName: e.target.value }))
                }
              />
            </Form.Item>
            <Form.Item
              name="newProjectId"
              label="Project Id"
              style={{ marginTop: "15px" }}
            >
              <Select
                style={{ width: "200%" }}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    newProjectId: value,
                  }))
                }
                placeholder="None"
              >
                {projects?.map((project) => (
                  <Select.Option key={project.id} value={project.id}>
                    {project.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="newUpperMenuId"
              label="upper Menu Id"
              style={{ marginTop: "15px" }}
            >
              <Select
                style={{ width: "200%" }}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    newUpperMenuId: value,
                  }))
                }
                placeholder="None"
              >
                {menus?.map((menu) => {
                  return (
                    <Select.Option value={menu.id}>{menu.name}</Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item name="newUrl" label="URL" style={{ marginTop: "15px" }}>
              <Input
                style={{ width: "200%" }}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, newUrl: e.target.value }))
                }
              />
            </Form.Item>
          </div>
          <div style={{ width: "100%", marginRight: "10%" }}>
            <Form.Item
              name="newOrderNo"
              label="order No"
              style={{ marginTop: "15px" }}
            >
              <Input
                style={{ width: "200%" }}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    newOrderNo: e.target.value,
                  }))
                }
              />
            </Form.Item>

            <Form.Item
              name="newIcon"
              label="icon"
              style={{ marginTop: "15px" }}
            >
              <Input
                style={{ width: "200%" }}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, newIcon: e.target.value }))
                }
              />
            </Form.Item>
            <Form.Item
              name="newIsVisible"
              label="is Visible"
              style={{ marginTop: "15px" }}
            >
              <Checkbox
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    newIsVisible: e.target.checked,
                  }))
                }
              />
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.type !== currentValues.type
              }
            ></Form.Item>
          </div>
        </div>

        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Button type="primary" htmlType="submit" onClick={onClick}>
            Create Menu
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
