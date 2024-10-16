import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [menus, setMenus] = useState([]);
  const [colLay, setColLay] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:3001/getProjects");
        const source = res.data.map((item) => ({
          key: item.ID,
          id: item.ID,
          name: item.AD,
        }));
        setProjects(source);
        setIsDataFetched(true);
      } catch (error) {
        console.error("Error reading data from file:", error);
      }
    };
    const fetchMenus = async () => {
      try {
        const res = await axios.get("http://localhost:3001/getMenus");
        const source = res.data.map((item) => ({
          key: item.id,
          id: item.id,
          name: item.name,
        }));
        setMenus(source);
        setIsDataFetched(true);
      } catch (error) {
        console.error("Error reading data from file:", error);
      }
    };
    const fetchColLayouts = async () => {
      try {
        const res = await axios.get("http://localhost:3001/getColLayout");
        const source = res.data.map((item) => ({
          key: item.ID,
          id: item.ID,
          name: item.AD,
        }));
        setColLay(source);
        setIsDataFetched(true);
      } catch (error) {
        console.error("Error reading data from file:", error);
      }
    };

    if (!isDataFetched) {
      fetchProjects();
      fetchMenus();
      fetchColLayouts();
    }
  }, [isDataFetched]);

  return (
    <MenuContext.Provider value={[projects, menus, colLay]}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenus = () => {
  return useContext(MenuContext);
};
