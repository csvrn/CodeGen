import { InputNumber, Input, Form, Select } from "antd";
import { useEffect, useState } from "react";
import { useMenus } from "./Context";
export const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  required,
  values,
  ...restProps
}) => {
  const OPTIONS = ["List Page", "Content Page", "Filter Page"];
  const [selectedItems, setSelectedItems] = useState(() => {
    return record && record["visibleScreens"]
      ? record["visibleScreens"].split(",")
      : [];
  });

  const [projects, menus, colLay] = useMenus();

  useEffect(() => {
    if (record && record["visibleScreens"]) {
      setSelectedItems(record["visibleScreens"].split(","));
    }
  }, [record]);

  const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o));

  const inputNode =
    inputType === "number" ? (
      <InputNumber />
    ) : dataIndex === "dataType" ? (
      <Select>
        <Select.Option value="Number">Number</Select.Option>
        <Select.Option value="String">String</Select.Option>
        <Select.Option value="Boolean">Boolean</Select.Option>
        <Select.Option value="Date">Date</Select.Option>
      </Select>
    ) : dataIndex === "componentId" ? (
      <Select>
        <Select.Option value={4}>Select</Select.Option>
        <Select.Option value={5}>AutoComplete</Select.Option>
        <Select.Option value={6}>ComboBox</Select.Option>
      </Select>
    ) : inputType === "combobox" ? (
      <Select
        mode="multiple"
        placeholder="Inserted are removed"
        value={selectedItems}
        onChange={(newSelectedItems) => {
          setSelectedItems(newSelectedItems);
          record["visibleScreens"] = newSelectedItems.join(",");
        }}
        style={{
          width: "100%",
        }}
        options={filteredOptions.map((item) => ({
          value: item,
          label: item,
        }))}
      />
    ) : inputType === "boolean" ? (
      <Select initialValues={record[dataIndex]}>
        <Select.Option value={1}>Yes</Select.Option>
        <Select.Option value={0}>No</Select.Option>
      </Select>
    ) : dataIndex === "menuId" || dataIndex === "upperMenuId" ? (
      <Select placeholder="None">
        {menus?.map((menu) => (
          <Select.Option key={menu.id} value={menu.id}>
            {menu.name}
          </Select.Option>
        ))}
      </Select>
    ) : dataIndex === "projectId" ? (
      <Select placeholder="None">
        {projects?.map((project) => (
          <Select.Option key={project.id} value={project.id}>
            {project.name}
          </Select.Option>
        ))}
      </Select>
    ) : inputType === "colLayout" ? (
      <Select placeholder="None">
        {colLay?.map((lay) => (
          <Select.Option key={lay.id} value={lay.id}>
            {lay.name}
          </Select.Option>
        ))}
      </Select>
    ) : (
      <Input />
    );

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: required,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
