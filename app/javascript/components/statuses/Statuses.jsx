import React from "react";
import Highlighter from 'react-highlight-words';
import { Button, Form, Input, Table, message, Popconfirm, Space } from "antd";
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';

class Statuses extends React.Component {
	formRef = React.createRef();

	state = {
		statuses: [],
		isSave: true,
		searchText: '',
    	searchedColumn: '',
	};

	getColumnSearchProps = dataIndex => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div style={{ padding: 8 }}>
			<Input
				ref={node => {
				this.searchInput = node;
				}}
				placeholder={`Search ${dataIndex}`}
				value={selectedKeys[0]}
				onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
				onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
				style={{ marginBottom: 8, display: 'block' }}
			/>
			<Space>
				<Button
				type="primary"
				onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
				icon={<SearchOutlined />}
				size="small"
				style={{ width: 90 }}
				>
				Search
				</Button>
				<Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
				Reset
				</Button>
				<Button
				type="link"
				size="small"
				onClick={() => {
					confirm({ closeDropdown: false });
					this.setState({
					searchText: selectedKeys[0],
					searchedColumn: dataIndex,
					});
				}}
				>
				Filter
				</Button>
			</Space>
			</div>
		),
		filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
		onFilter: (value, record) =>
			record[dataIndex]
			? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
			: '',
		onFilterDropdownVisibleChange: visible => {
			if (visible) {
			setTimeout(() => this.searchInput.select(), 100);
			}
		},
		render: text =>
			this.state.searchedColumn === dataIndex ? (
			<Highlighter
				highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
				searchWords={[this.state.searchText]}
				autoEscape
				textToHighlight={text ? text.toString() : ''}
			/>
			) : (
			text
		),
	});
	
	handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		this.setState({
			searchText: selectedKeys[0],
			searchedColumn: dataIndex,
		});
	};

	handleReset = clearFilters => {
		clearFilters();
		this.setState({ searchText: '' });
		};

	onChange(pagination, filters, sorter, extra) {
		console.log('params', pagination, filters, sorter, extra);
	}
	
	columns = [
		{
			title: "表示順",
			dataIndex: "display_order",
			key: "display_order",
			sorter: (a, b) => a.display_order - b.display_order,	
		},
		{
			title: "骨子ステータス",
			dataIndex: "status",
			key: "status",
			width: '40%',
			sorter: (a, b) => a.status.length  - b.status.length,
			...this.getColumnSearchProps('status'),
		},
		{
			title: "骨子ステータス色",
			dataIndex: "status_color",
			key: "status_color",
			width: '40%',
			sorter: (a, b) => a.status_color.length  - b.status_color.length,
			...this.getColumnSearchProps('status_color'),
		},
		{
			title: "操作",
			key: "action",
			render: (_text, record) => (
				<Space size="middle">
					<a onClick={() => this.editStatus(record)}><EditOutlined /></a>
					<Popconfirm
					title="削除してもよろしいでしょうか？"
					onConfirm={() => this.deleteStatus(record)}
					okText="Yes"
					cancelText="No"
				>
					<a href="#" type="danger">
					<DeleteOutlined />{" "}
					</a>
				</Popconfirm>
				</Space>		
			),
		},
	];

	componentDidMount() {
		this.loadStatuses();
		this.formRef.current.setFieldsValue({
			kosshiPK: null,
			kosshiSK: null,
			display_order: 0,
			status:'',
			status_color: '',
		  });
	}

	loadStatuses = () => {
		const url = "/api/v1/status/index";
		console.log(url)
		fetch(url)
			.then((data) => {
				if (data.ok) {
					return data.json();
				}
				throw new Error("Network error.");
			})
			.then((data) => {
				data.forEach((status) => {
					const newEl = {
						key: status.display_order,
						display_order: status.display_order,
						kosshiPK: status.kosshiPK,
						kosshiSK: status.kosshiSK,
						status: status.status,
						status_color: status.status_color,
					};

					this.setState((prevState) => ({
						statuses: [...prevState.statuses, newEl],
					}));
				});
			})
			.catch((err) => message.error("Error: " + err));
	};

	reloadStatuses = () => {
		this.setState({ statuses: [], isSave: true });
		this.loadStatuses();
		this.formRef.current.setFieldsValue({
			kosshiPK: null,
			kosshiSK: null,
			display_order: 0,
			status:'',
			status_color: '',
		  });
	};

	onFinish = (values) => {
		if(values.kosshiPK != null ){
			console.log("Update Status")
			console.log(values)
			const url = `/api/v1/status/update/${values.kosshiSK}`;
			fetch(url, {
				method: "put",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			})
			.then((data) => {
				if (data.ok) {
					this.reloadStatuses();
					return data.json();
				}
				throw new Error("Network error.");
			})
			.catch((err) => message.error("Error: " + err));
			
		} else {
			console.log("Add Status")
			console.log(values)
			const url = "/api/v1/status/create";
			fetch(url, {
				method: "post",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			})
			.then((data) => {
				if (data.ok) {
					this.reloadStatuses();
					return data.json();
				}
				throw new Error("Network error.");
			})
			.catch((err) => message.error("Error: " + err));
		}
		
	};

	editStatus = (status) => {
		const koshiInt = status.kosshiSK
		console.log(status)
		this.setState({ isSave: false});
		this.formRef.current.setFieldsValue({
			key: status.kosshiSK,
			kosshiPK: status.kosshiPK,
			display_order: status.display_order,
			kosshiSK: status.kosshiSK,
			status: status.status,
			status_color: status.status_color,
		  });
	};

	deleteStatus = (status) => {
		const url = `/api/v1/status/${status.kosshiPK}/${status.kosshiSK}`;
		console.log("delete Status")
		fetch(url, {
			method: "delete",
		})
			.then((data) => {
				console.log(data)
				if (data.ok) {
					this.reloadStatuses();
					return data.json();
				}
				throw new Error("Network error.");
			})
			.catch((err) => message.error("Error: " + err));
	};

	render() {
		return (
			<>
				<Form labelCol={{ span: 10 }} wrapperCol={{ span: 6 }} ref={this.formRef} layout="horizontal" onFinish={this.onFinish}>					
					<Form.Item
						label="表示順"
						name="display_order"
						rules={[
							{ required: true, message: "表示順を入力してください" },
						]}
					>
						<Input type="number" placeholder="表示順を入力してください"/>
					</Form.Item>

					<Form.Item
						label="骨子ステータス"
						name="status"
						rules={[
							{ required: true, message: "骨子ステータスを入力してください" },
						]}
					>
						<Input allowClear placeholder="骨子ステータスを入力してください" />
					</Form.Item>

					<Form.Item
						label="骨子ステータス色"
						name="status_color" 
						rules={[
							{
								required: true,
								message: "骨子ステータス色を入力してください",
							},
						]}
					>
						<Input allowClear placeholder="骨子ステータス色を入力してください" />
					</Form.Item>

					<Form.Item wrapperCol={{ offset: 10, span: 8 }}>
						<Button type="primary" htmlType="submit">
							{this.state.isSave ? '保存' : '更新'}
						</Button>
					</Form.Item>
					<Form.Item label="" name="kosshiPK">
						<Input type="hidden"/>
					</Form.Item>
					<Form.Item label="" name="kosshiSK">
						<Input type="hidden"/>
					</Form.Item>
				</Form>
				<Table
					className="table-striped-rows"
					dataSource={this.state.statuses}
					columns={this.columns}
					pagination={{ pageSize: 5 }}
				/>			
			</>
		);
	}
}

export default Statuses;
