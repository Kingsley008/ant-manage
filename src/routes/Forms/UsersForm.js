import React, {Component} from 'react';
import {Button, Form, Input, Popconfirm, Table, Modal} from 'antd';
import {connect} from 'dva';
import md5 from 'js-md5';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 7},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 12},
    md: {span: 10},
  },
};

const submitFormLayout = {
  wrapperCol: {
    xs: {span: 24, offset: 0},
    sm: {span: 10, offset: 7},
  },
};

const FormItem = Form.Item;

const EditableCell = ({editable, value, onChange}) => (
  <div>
    {editable
      ? <Input style={{margin: '-5px 0'}} value={value} onChange={e => onChange(e.target.value)}/>
      : value
    }
  </div>
);
@connect((state) => ({
  visible: state.users.visible,
  loading: state.users.loading,
  data: state.users.usersList,
  totalCount: state.users.totalCount,
  userName: state.login.userName,
}))

@Form.create()
export default class UsersForm extends Component {
  constructor(props) {
    super(props);
    if (this.props.userName === null) {
      this.props.dispatch({
        type: 'login/invalidLogin'
      })
    }
    // 默认返回第一页数据
    this.state = {
      currentPage: 1
    };

    this.columns = [{
      title: 'Id',
      dataIndex: 'id',
      key: 1,
      render: (text, record) => this.renderColumns(text, record, 'id'),
    },
      {
        title: '手机号码',
        dataIndex: 'phoneNumber',
        key: 2,
        render: (text, record) => this.renderColumns(text, record, 'phoneNumber'),
      },
      {
        title: '密码',
        dataIndex: 'password',
        key: 3,
        render: (text, record) => this.renderColumns(text, record, 'password'),
      },
      {
        title: '收件人',
        dataIndex: 'trueName',
        key: 4,
        render: (text, record) => this.renderColumns(text, record, 'trueName'),
      },
      {
        title: '地址',
        dataIndex: 'address',
        key: 5,
        render: (text, record) => this.renderColumns(text, record, 'address'),
      },
      {
        title: '帐号类型',
        dataIndex: 'type',
        key: 6,
        render: (text, record) => this.renderColumns(text, record, 'type'),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 7,
        render: (text, record) => {
          const {editable} = record;
          return (
            <div className="editable-row-operations">
              {
                editable ?
                  <span>
                  <a onClick={() => this.save(record.id)}>保存</a>
                  <span style={{marginRight: 5, marginLeft: 5}}>|</span>
                  <Popconfirm title="确定取消?" onConfirm={() => this.cancel(record.id)}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
                  : <span><a onClick={() => this.edit(record.id)} style={{marginRight: 10}}>编辑</a>
                  <Popconfirm title="确定删除？" onConfirm={() => this.deleteUser(record.id)}>
                    <Button type='danger'>
                      删除
                    </Button>
                  </Popconfirm>
                  </span>
              }
            </div>
          );
        },
      }];
    //初始化 列表 data
    this.props.dispatch({
      type: 'users/getUsersList',
      payload: this.state.currentPage,
    });

  }

  renderColumns(text, record, column) {

    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.id, column)}
      />
    );
  }

  handleChange(value, key, column) {

    this.props.dispatch({
      type: 'users/onHandleUsersChange',
      payload: {value: value, id: key, column: column}
    })
  }

  edit(key) {

    this.props.dispatch({
      type: 'users/editUsersList',
      payload: key
    })

  }

  save(id) {
    const newData = this.props.data;
    console.log(newData);
    this.props.dispatch({
      type: 'users/saveUsersList',
      payload: {id: id, newData: newData}
    });
  }

  deleteUser(id) {

    this.props.dispatch({
      type: 'users/deleteUsers',
      payload: id
    });

    this.props.dispatch({
      type: 'users/getUsersList',
      payload: this.state.currentPage,
    });

  }

  cancel(key) {
    this.props.dispatch({
      type: 'users/cancelUsersList',
      payload: key
    })
  }

  showModal = () => {
    this.props.dispatch({
      type: 'users/changeUsersFormVisibility',
      payload: true
    })
  };

  handleOk = () => {

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
        values.password = md5(values.password);
        values.id = 0;
        this.props.dispatch({
          type: 'users/submitUsersForm',
          payload: values,
        });

        this.setState({loading: false, visible: false});
      }
    });

  };

  onChangePage = (page) => {

    this.props.dispatch({
      type: 'users/getUsersList',
      payload: page,
    });

    this.setState({
      currentPage: page
    })
  };

  handleCancel = () => {
    this.props.dispatch({
      type: 'users/changeUsersFormVisibility',
      payload: false
    })
  };

  render() {
    const {loading, visible} = this.props;
    const {getFieldDecorator} = this.props.form;

    return (
      <div>
        <PageHeaderLayout title="用户管理" content=""/>
        <Button style={{marginBottom: 20, marginTop:20}} type="primary" onClick={this.showModal}>
          添加新用户
        </Button>
        <Modal
          visible={visible}
          title="添加新的用户"
          onCancel={this.handleCancel}
          footer={[
            <FormItem>
              <Button key="back" onClick={this.handleCancel}>返回</Button>,
              <Button key="submit" htmlType="submit" type="primary" loading={loading} onClick={this.handleOk}>
                提交
              </Button>
            </FormItem>
          ]}
        >
          <Form
            onSubmit={this.handleSubmit}
          >

            <div style={{marginBottom: 50}}>
              <FormItem
                label="手机号"
                {...formItemLayout}
              >
                {getFieldDecorator('phoneNumber', {
                  rules: [{
                    required: true,
                    message: '请输入正确的手机号',
                    pattern:/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/,
                  }],
                })(
                  <Input>
                  </Input>
                )}
              </FormItem>

              <FormItem
                label="密码"
                {...formItemLayout}
              >
                {getFieldDecorator('password', {
                  rules: [{
                    required: true, message: '请选择密码',
                  }],
                })(
                  <Input>
                  </Input>
                )}
              </FormItem>

              <FormItem
                label="地址"
                {...formItemLayout}
              >
                {getFieldDecorator('address', {
                  rules: [{
                    required: true, message: '请填写收获地址',
                  }],
                })(
                  <Input>
                  </Input>
                )}
              </FormItem>

              <FormItem
                label="收货人"
                {...formItemLayout}
              >
                {getFieldDecorator('trueName', {
                  rules: [{
                    required: true, message: '请填写收货人',
                  }],
                })(
                  <Input>
                  </Input>
                )}
              </FormItem>

              <FormItem
                label="帐号类型"
                {...formItemLayout}
              >
                {getFieldDecorator('type', {
                  rules: [{
                    required: true, message: '请填写帐号类型',
                    placeholder:'1 管理员 0 普通用户',
                  }],
                })(
                  <Input placeholder = '1 管理员 0 普通用户' >
                  </Input>
                )}
              </FormItem>

            </div>
          </Form>
        </Modal>

        <Table loading={loading} rowKey="uid" bordered dataSource={this.props.data}
               columns={this.columns}
               pagination={{
                 total: this.props.totalCount,
                 current: this.state.currentPage,
                 onChange: (page) => {
                   this.onChangePage(page)
                 }
               }}/>
      </div>
    )
  }

}
