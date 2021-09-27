import { Layout } from "antd";
import React from "react";
import Statuses from "./Statuses";
import Header from "../Header";

const { Content, Footer } = Layout;

export default () => (
	<Layout className="layout">
		<Header />
		<Content style={{ padding: "0 50px" }}>
			<div className="site-layout-content" style={{ margin: "10px auto" }}>
				<h3 style={{padding: "20px 0px 0px 30px"}}>骨子ステータス登録</h3>
				<Statuses />
			</div>
		</Content>
		<Footer style={{ textAlign: "center" }}>
			GIC ©2021.
		</Footer>
	</Layout>
);
