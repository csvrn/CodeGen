import React from "react";
import { Outlet } from "react-router-dom";
import { MenuBar } from "./MenuBar";
import { MainHeader } from "./MainHeader";
import { Layout } from "antd";

const RootLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "green" }}>
      <MainHeader />
      <Layout>
        <MenuBar />
        <></>
        <Outlet />
      </Layout>
    </Layout>
  );
};
export default RootLayout;
