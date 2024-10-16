import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;
const { SubMenu, Item: MenuItem } = Menu;

export const MenuBar = () => {
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);
  const [screens, setScreens] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const [projectsResponse, menusResponse, screensResponse] =
        await Promise.all([
          axios.get("http://localhost:3001/getProjects"),
          axios.get("http://localhost:3001/getMenus"),
          axios.get("http://localhost:3001/getScreens"),
        ]);
      setProjects(projectsResponse.data);
      setMenus(menusResponse.data);
      setScreens(screensResponse.data);

      localStorage.setItem("projects", JSON.stringify(projectsResponse.data));
      localStorage.setItem("menus", JSON.stringify(menusResponse.data));
      localStorage.setItem("screens", JSON.stringify(screensResponse.data));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const buildNestedMenus = useMemo(() => {
    const projectMenusMap = new Map();

    const menuScreensMap = new Map();

    screens.forEach((screen) => {
      const menuId = screen.MENU_ID;
      if (!menuScreensMap.has(menuId)) {
        menuScreensMap.set(menuId, []);
      }
      menuScreensMap.get(menuId).push(screen);
    });

    menus.forEach((menu) => {
      const menuScreens = menuScreensMap.get(menu.id) || [];

      const projectId = menu.projectId;

      if (!projectMenusMap.has(projectId)) {
        projectMenusMap.set(projectId, []);
      }
      projectMenusMap.get(projectId).push({ ...menu, screens: menuScreens });
    });

    const renderMenuItems = (subMenus, upperMenuId) => {
      return subMenus.map((menu) => {
        const menuScreens = menuScreensMap.get(menu.id) || [];
        return (
          <SubMenu title={menu.name} key={menu.name}>
            {menuScreens.length > 0 &&
              menuScreens.map((screen) => (
                <MenuItem key={screen.AD} onClick={() => getItem(screen)}>
                  {screen.AD}
                </MenuItem>
              ))}
            {menuScreens.length === 0 && menu.subMenus.length === 0 && (
              <MenuItem key={`${menu.name}_0`}>Gösterilecek Menü Yok</MenuItem>
            )}
            {renderMenuItems(menu.subMenus, menu.id)}
          </SubMenu>
        );
      });
    };

    return (
      <>
        {projects.map((project) => {
          const projectMenus = projectMenusMap.get(project.ID) || [];
          const subMenus = projectMenus.filter(
            (menu) => menu.upperMenuId === 0
          );

          return (
            <SubMenu title={project.AD} key={project.ID}>
              {subMenus.length > 0 ? (
                renderMenuItems(subMenus, 0)
              ) : (
                <MenuItem key={`${project.name}_0`}>
                  Gösterilecek Menü Yok
                </MenuItem>
              )}
            </SubMenu>
          );
        })}
      </>
    );
  }, [projects, menus, screens]);

  const getItem = (screen) => {
    navigate(`/detail/${screen.AD}`);
  };

  return (
    <Sider
      style={{
        textAlign: "center",
        lineHeight: "120px",
        color: "#fff",
        backgroundColor: "white",
      }}
      trigger={null}
      collapsible
    >
      <Menu defaultSelectedKeys={["1"]}>
        <SubMenu style={{ marginTop: "20px" }} key="projeler" title="Projeler">
          {buildNestedMenus}
        </SubMenu>
        <div
          style={{
            margin: "0 5%",
            display: "flex",
            textAlign: "center",
            border: "LightGray solid 1px",
          }}
        ></div>
        <MenuItem key={menus.length + 1} onClick={() => navigate("/")}>
          Projeleri Düzenle
        </MenuItem>
        <MenuItem key={menus.length + 2} onClick={() => navigate("/menus")}>
          Menuleri Düzenle
        </MenuItem>
        <MenuItem key={menus.length + 3} onClick={() => navigate("/screens")}>
          Ekranları Düzenle
        </MenuItem>
      </Menu>
    </Sider>
  );
};
