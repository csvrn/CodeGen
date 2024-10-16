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
import axios from "axios";
import { EditableCell } from "./EditableCell";

export const ScreenDetailPage = () => {
  const { Header } = Layout;
  const [dataSource, setDataSource] = useState([]);
  const [form] = Form.useForm();

  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const [formData, setFormData] = useState({});
  const [menus, setMenus] = useState([]);
  const fetchScreens = async () => {
    try {
      const res = await axios.get("http://localhost:3001/getScreensWithMenu");
      return res.data;
    } catch (error) {
      console.error("Error reading data from file:", error);
    }
  };
  const fetchMenus = async () => {
    try {
      const res = await axios.get("http://localhost:3001/getMenus");

      return res.data;
    } catch (error) {
      console.error("Error reading data from file:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchScreens();
        const source = [];
        for (const i in Object.values(res)) {
          const item = res[i];
          source.push({
            key: item.ID,
            id: item.ID,
            name: item.AD,
            menuId: item.MENU_ID,
            menuName: item.MENU_NAME,
            url: item.URL,
            searchOnLoad: item.SEARCH_ON_LOAD,
            showNewItem: item.SHOW_NEW_ITEM,
            showEdit: item.SHOW_EDIT,
            showDelete: item.SHOW_DELETE,
            orderNo: item.SIRA_NO,
            controller: item.CONTROLLER,
            isVisible: item.GORUNSUN_MU,
            isActive: item.ISACTIVE,
          });
        }

        setDataSource(source);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchMenuData = async () => {
      try {
        const res = await fetchMenus();
        const source = [];
        for (const i in Object.values(res)) {
          const item = res[i];
          source.push({
            key: item.ID,
            id: item.ID,
            name: item.AD,
          });
        }
        setMenus(res);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchMenuData();
    fetchData();
  }, []);

  const updateDataSource = (item) => {
    setDataSource((prev) => [
      ...prev,
      {
        key: item.ID,
        id: item.ID,
        name: item.AD,
        menuId: item.MENU_ID,
        menuName: item.MENU_NAME,
        url: item.URL,
        searchOnLoad: item.SEARCH_ON_LOAD,
        showNewItem: item.SHOW_NEW_ITEM,
        showEdit: item.SHOW_EDIT,
        showDelete: item.SHOW_DELETE,
        orderNo: item.SIRA_NO,
        controller: item.CONTROLLER,
        isVisible: item.GORUNSUN_MU,
        isActive: item.ISACTIVE,
      },
    ]);
  };
  const onFinish = async (values) => {
    const allScreens = await fetchScreens();
    const screen = {
      ID: values.ID,
      AD: values.AD,
      MENU_ID: values.MENU_ID,
      MENU_NAME: values.MENU_NAME,
      URL: values.URL,
      SEARCH_ON_LOAD: values.SEARCH_ON_LOAD,
      SHOW_NEW_ITEM: values.SHOW_NEW_ITEM,
      SHOW_EDIT: values.SHOW_EDIT,
      SHOW_DELETE: values.SHOW_DELETE,
      SIRA_NO: values.SIRA_NO,
      CONTROLLER: values.CONTROLLER,
      GORUNSUN_MU: values.GORUNSUN_MU,
      ISACTIVE: values.ISACTIVE,
    };

    allScreens[Object.entries(allScreens).length] = screen;
    updateDataSource(allScreens);

    try {
      const res = await axios.post("http://localhost:3001/createScreen", {
        data: screen,
      });
      console.log("Data written to file successfully");
      form.resetFields();
      return res;
    } catch (error) {
      console.error("Error writing data to file:", error);
    }
  };
  const deleteRecordByKey = async (screen) => {
    try {
      const res = await axios.post("http://localhost:3001/deleteScreen", {
        data: screen,
      });
      console.log("Deleted screen successfully");
      return res;
    } catch (error) {
      console.error("Error deleting screen: ", error);
    }
  };
  const onClick = async (values) => {
    const screen = {
      ID: formData.ID,
      AD: formData.newName,
      MENU_ID: formData.newMenuId,
      URL: formData.newUrl,
      SEARCH_ON_LOAD: formData.newSearch ? "1" : "0",
      SHOW_NEW_ITEM: formData.newNewItem ? "1" : "0",
      SHOW_EDIT: formData.newEdit ? "1" : "0",
      SHOW_DELETE: formData.newDelete ? "1" : "0",
      SIRA_NO: formData.newOrderNo,
      CONTROLLER: formData.newController,
      GORUNSUN_MU: formData.newIsVisible ? "1" : "0",
      ISACTIVE: formData.newIsActive ? "1" : "0",
    };

    updateDataSource(screen);

    try {
      const res = await axios.post("http://localhost:3001/createScreen", {
        data: {
          ID: formData.ID,
          AD: formData.newName,
          MENU_ID: formData.newMenuId,
          URL: formData.newUrl,
          SEARCH_ON_LOAD: formData.newSearch ? "1" : "0",
          SHOW_NEW_ITEM: formData.newNewItem ? "1" : "0",
          SHOW_EDIT: formData.newEdit ? "1" : "0",
          SHOW_DELETE: formData.newDelete ? "1" : "0",
          SIRA_NO: formData.newOrderNo,
          CONTROLLER: formData.newController,
          GORUNSUN_MU: formData.newIsVisible ? "1" : "0",
          ISACTIVE: formData.newIsActive ? "1" : "0",
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
      console.log(res);
    } catch (errInfo) {
      console.log("Delete Failed:", errInfo);
    }
  };
  const updateScreen = async (screen) => {
    try {
      const res = await axios.post("http://localhost:3001/updateScreen", {
        data: screen,
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
      menuId: "",
      menuName: "",
      url: "",
      searchOnLoad: "",
      showNewItem: "",
      showEdit: "",
      showDelete: "",
      orderNo: "",
      controller: "",
      isVisible: "",
      isActive: "",
      ...record,
    });
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
        const res = await updateScreen({ ...record, ...row, id: record.id });
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
      width: "80px",
      fixed: "left",
    },
    {
      title: "Menu Id",
      dataIndex: "menuId",
      key: "projectId",
      editable: true,
      width: "250px",
      inputType: "menu",
      render: (_, record) => {
        return record.menuName;
      },
    },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
      editable: true,
      width: "250px",
    },
    {
      title: "Search",
      dataIndex: "searchOnLoad",
      key: "searchOnLoad",
      editable: true,
      width: "80px",
      inputType: "boolean",
      render: (text) => {
        return text ? "Yes" : "No";
      },
    },

    {
      title: "Show",
      dataIndex: "showNewItem",
      key: "showNewItem",
      editable: true,
      width: "80px",
      inputType: "boolean",
      render: (text) => {
        return text ? "Yes" : "No";
      },
    },
    {
      title: "Edit",
      dataIndex: "showEdit",
      key: "showEdit",
      editable: true,
      width: "80px",
      inputType: "boolean",
      render: (text) => {
        return text ? "Yes" : "No";
      },
    },
    {
      title: "Delete",
      dataIndex: "showDelete",
      key: "showDelete",
      editable: true,
      width: "80px",
      inputType: "boolean",
      render: (text) => {
        return text ? "Yes" : "No";
      },
    },
    {
      title: "Order No",
      dataIndex: "orderNo",
      key: "orderNo",
      editable: true,
      width: "80px",
    },
    {
      title: "Controller",
      dataIndex: "controller",
      key: "controller",
      editable: true,
      width: "100px",
    },
    {
      title: "Is Visible",
      dataIndex: "isVisible",
      key: "isVisible",
      editable: true,
      width: "80px",
      inputType: "boolean",
      render: (text) => {
        return text ? "Yes" : "No";
      },
    },
    {
      title: "Edit",
      dataIndex: "operation",
      width: "80px",
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
      width: "80px",
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
        Ekranlar
      </Header>
      <Form
        form={form}
        labelCol={{ span: 15 }}
        wrapperCol={{ span: 5 }}
        onFinish={onFinish}
      >
        <Row gutter={14}>
          <Col span={10}>
            <Form.Item
              name="newName"
              label="Yeni Menü Adı"
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
              name="newMenuId"
              label="Menu"
              style={{ marginTop: "15px" }}
            >
              <Select
                style={{ width: "200%" }}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    newMenuId: value,
                  }))
                }
                placeholder="None"
              >
                {menus.map((menu) => {
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
                  setFormData((prev) => ({
                    ...prev,
                    newUrl: e.target.value,
                  }))
                }
              />
            </Form.Item>
            <Form.Item
              name="newOrderNo"
              label="Order No"
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
          </Col>
          <Col span={6}>
            <Row>
              <Form.Item
                name="newController"
                label="Yeni Controller"
                style={{ marginTop: "15px" }}
              >
                <Input
                  style={{ width: "250%" }}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      newController: e.target.value,
                    }))
                  }
                />
              </Form.Item>
            </Row>
            <Form.Item
              name="newIsVisible"
              label="is Visible"
              style={{
                marginTop: "15px",

                textAlign: "left",
              }}
            >
              <Checkbox
                style={{ width: "auto" }}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    newIsVisible: e.target.checked,
                  }))
                }
              />
            </Form.Item>

            <Form.Item
              name="newNewItem"
              label="Show New Item"
              style={{
                marginTop: "15px",
              }}
            >
              <Checkbox
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    newNewItem: e.target.checked,
                  }))
                }
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="newEdit"
              label="Show Edit"
              style={{ marginTop: "15px" }}
            >
              <Checkbox
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    newEdit: e.target.checked,
                  }))
                }
              />
            </Form.Item>
            <Form.Item
              name="newDelete"
              label="Show Delete"
              style={{ marginTop: "15px" }}
            >
              <Checkbox
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    newDelete: e.target.checked,
                  }))
                }
              />
            </Form.Item>

            <Form.Item
              name="newSearch"
              label="Search On Load"
              style={{ marginTop: "15px" }}
            >
              <Checkbox
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    newSearch: e.target.checked,
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
              Create Screen
            </Button>
          </Form.Item>
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
