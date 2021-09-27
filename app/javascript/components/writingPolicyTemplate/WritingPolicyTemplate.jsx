import React from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Table,
  message,
  Select,
  Popconfirm,
  Space,
} from "antd";

class WritingPolicyTemplate extends React.Component {
  formRef = React.createRef();

  state = {
    templates: [],
    isSave: true,
  };

  componentDidMount() {
    console.log("component Dit Mount");
    // 執筆方針テンプレートを取得する
    this.loadWritingPolicyTemplates();
  }

  loadWritingPolicyTemplates = () => {
    console.log("load templates");
    const url = "/api/v1/writing_policy_template/index";
    fetch(url)
      .then((data) => {
        if (data.ok) {
          return data.json();
        }
        throw new Error("Network error.");
      })
      .then((data) => {
        data.forEach((template) => {
          const newEl = {
            key: template.display_order,
            template_type: template.template_type,
            display_order: template.display_order,
            template_name: template.template_name,
            templatePK: template.templatePK,
            templateSK: template.templateSK,
            template_content: template.template_content,
          };

          this.setState((prevState) => ({
            templates: [...prevState.templates, newEl],
          }));
        });
        // this.setState({
        //   templates: data,
        // });
      })
      .catch((err) => message.error("Error: " + err));
  };

  deleteTemplate = (template) => {
    console.log("template", template);
    const url = `/api/v1/writing_policy_template/${template.templatePK}/${template.templateSK}`;
    console.log("delete writing_policy_template");
    fetch(url, {
      method: "delete",
    })
      .then((data) => {
        console.log(data);
        if (data.ok) {
          this.reloadTemplates();
          return data.json();
        }
        throw new Error("Network error.");
      })
      .catch((err) => message.error("Error: " + err));
  };

  onFinish = (values) => {
    if (values.templatePK != null) {
      console.log("Update writing_policy_template");
      console.log(values);
      const url = `/api/v1/writing_policy_template/update/${values.templateSK}`;
      fetch(url, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((data) => {
          if (data.ok) {
            this.reloadTemplates();
            return data.json();
          }
          throw new Error("Network error.");
        })
        .catch((err) => message.error("Error: " + err));
    } else {
      console.log("Add writing_policy_template");
      console.log(values);
      const url = "/api/v1/writing_policy_template/create";
      fetch(url, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((data) => {
          if (data.ok) {
            this.reloadTemplates();
            return data.json();
          }
          throw new Error("Network error.");
        })
        .catch((err) => message.error("Error: " + err));
    }
  };

  editTemplate = (template) => {
    const koshiInt = template.templateSK;
    this.setState({ isSave: false });
    this.formRef.current.setFieldsValue({
      key: template.templateSK,
      templatePK: template.templatePK,
      display_order: template.display_order,
      templateSK: template.templateSK,
      template_type: template.template_type,
      template_name: template.template_name,
      template_content: template.template_content,
    });
  };

  reloadTemplates = () => {
    this.setState({ templates: [], isSave: true });
    this.loadWritingPolicyTemplates();
    this.formRef.current.resetFields();
  };

  columns = [
    {
      title: "番号",
      dataIndex: "key",
      key: "key",
      sorter: (a, b) => a.key - b.key,
    },
    {
      title: "テンプレート種類",
      dataIndex: "template_type",
      key: "template_type",
      sorter: (a, b) => a.template_type.length - b.template_type.length,
    },
    {
      title: "表示順",
      dataIndex: "display_order",
      key: "display_order",
      sorter: (a, b) => a.display_order.length - b.display_order.length,
    },
    {
      title: "テンプレート名称",
      dataIndex: "template_name",
      key: "template_name",
      sorter: (a, b) => a.template_name.length - b.template_name.length,
    },
    {
      title: "テンプレート内容",
      dataIndex: "template_content",
      key: "template_content",
      sorter: (a, b) => a.template_content.length - b.template_content.length,
    },
    {
      title: "操作",
      key: "action",
      render: (_text, record) => (
        <Space size="middle">
          <a onClick={() => this.editTemplate(record)}>
            <EditOutlined />
          </a>
          <Popconfirm
            title="削除してもよろしいでしょうか？"
            onConfirm={() => this.deleteTemplate(record)}
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
  render() {
    return (
      <>
        <Form
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 6 }}
          ref={this.formRef}
          layout="horizontal"
          onFinish={this.onFinish}
        >
          <Form.Item
            label="テンプレート種類"
            name="template_type"
            rules={[
              { required: true, message: "テンプレート種類を入力してください" },
            ]}
          >
            <Select>
              <Select.Option value="記事の幅">記事の幅</Select.Option>
              <Select.Option value="記事の深さ">記事の深さ</Select.Option>
              <Select.Option value="記事の読みやすさ">
                記事の読みやすさ
              </Select.Option>
              <Select.Option value="CV誘導方法">CV誘導方法</Select.Option>
              <Select.Option value="見出し詳細">見出し詳細</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="表示順"
            name="display_order"
            rules={[{ required: true, message: "表示順を入力してください" }]}
          >
            <Input type="number" placeholder="表示順を入力してください" />
          </Form.Item>

          <Form.Item
            label="テンプレート名称"
            name="template_name"
            rules={[
              {
                required: true,
                message: "テンプレート名称を入力してください",
              },
            ]}
          >
            <Input
              allowClear
              placeholder="テンプレート名称を入力してください"
            />
          </Form.Item>

          <Form.Item
            label="テンプレート内容"
            name="template_content"
            rules={[
              {
                required: true,
                message: "テンプレート内容を入力してください",
              },
            ]}
          >
            <Input.TextArea
              allowClear
              placeholder="テンプレート内容を入力してください"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 10, span: 8 }}>
            <Button type="primary" htmlType="submit">
              {this.state.isSave ? "保存" : "更新"}
            </Button>
          </Form.Item>
        </Form>
        <Table
          className="table-striped-rows"
          dataSource={this.state.templates}
          columns={this.columns}
          pagination={{ pageSize: 10 }}
        />
      </>
    );
  }
}

export default WritingPolicyTemplate;
