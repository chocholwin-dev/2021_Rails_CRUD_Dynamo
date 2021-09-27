import { Layout } from "antd";
import React from "react";
import Header from "../Header";
import WritingPolicyTemplate from "../writingPolicyTemplate/WritingPolicyTemplate";

const { Content, Footer } = Layout;

export default () => (
  <Layout className="layout">
    <Header />
    <Content style={{ padding: "0 50px" }}>
      <div className="site-layout-content" style={{ margin: "10px auto" }}>
        <h3 style={{ padding: "20px 0px 0px 30px" }}>
          執筆方針テンプレート管理
        </h3>
        <WritingPolicyTemplate />
      </div>
    </Content>
    <Footer style={{ textAlign: "center" }}>GIC ©2021.</Footer>
  </Layout>
);
