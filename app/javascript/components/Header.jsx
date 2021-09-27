import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";

const { Header } = Layout;

export default () => (
	<Header>
		<div className="logo" />
		<Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
			<Menu.Item key="1"><a href="/">骨子ステータス管理</a></Menu.Item>
			<Menu.Item key="2"><Link to="/writing_policy_template/index">執筆方針テンプレート管理</Link></Menu.Item>
		</Menu>
	</Header>
);
