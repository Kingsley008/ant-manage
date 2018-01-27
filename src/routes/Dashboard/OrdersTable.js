import React, {Component} from 'react';
import {connect} from 'dva';
import {Button, DatePicker, Form, Input, Popconfirm, Select, Table} from 'antd';
import {routerRedux} from 'dva/router';
import {total} from "../../components/Charts/Pie/index";
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
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
  orderList: state.orders.orderList,
  total: state.orders.totalCount,
  userName: state.login.userName,
  loading: state.orders.loading,
  visible: state.orders.visible,
}))

@Form.create()
export default class OrdersTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
    };
    this.onChangePage = this.onChangePage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);

    this.columns = [
      {
        title: '订单号',
        dataIndex: 'id',
        key: 1,
      },
      {
        title: '商品图片',
        dataIndex: 'icon',
        key: 2,
        render: (value) => {
          return (
            <div>
              <img src={value} style={{
                display: 'inline-block',
                height: '100px',
                width: '100px',
                zoom: '1',
                border: '1px solid black'
              }}></img>
            </div>
          )
        }
      },
      {
        title: '收件人',
        dataIndex: 'trueName',
        key: 3,
        render: (text, record) => this.renderColumns(text, record, 'trueName'),
      },
      {
        title: '收件地址',
        dataIndex: 'address',
        key: 4,
        render: (text, record) => this.renderColumns(text, record, 'address'),
      },
      {
        title: '颜色',
        dataIndex: 'color',
        key: 5,
        render: (text, record) => this.renderColumns(text, record, 'color'),
      },
      {
        title: '尺寸',
        dataIndex: 'size',
        key: 6,
        render: (text, record) => this.renderColumns(text, record, 'size'),
      },
      {
        title: '购买时间',
        dataIndex: 'buyTime',
        key: 7,
      },
      {
        title: '购买数量',
        dataIndex: 'buyNumber',
        key: 8,
        render: (text, record) => this.renderColumns(text, record, 'buyNumber'),
      },
      {
        title: '购买价格',
        dataIndex: 'price',
        key: 9,
        render: (text, record) => this.renderColumns(text, record, 'price'),
      },
      {
        title: '评价',
        dataIndex: 'rank',
        key: 10,
        render: (text, record) => {
          let result = '';
          if (text == 1) {
            result = '好评'
          }
          if (text == 2) {
            result = '中评'
          }
          if (text == 3) {
            result = '差评'
          }
          return (
            <div>
              {result}
            </div>
          )
        }
      },
      {
        title: '评价内容',
        dataIndex: 'comments',
        key: 11,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 12,
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
                  <Popconfirm title="确定删除？" onConfirm={() => this.deleteOrder(record.id)}>
                    <Button type='danger'>
                      删除
                    </Button>
                  </Popconfirm>
                  </span>
              }
            </div>
          );
        },
      }
    ]
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

  onChangePage(pageNumber) {
    this.state.values.currentPage = pageNumber;
    this.state.currentPage = pageNumber;

    this.props.dispatch({
      type: 'orders/getOrderList',
      payload: this.state.values,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.currentPage = this.state.currentPage;
        this.props.dispatch({
          type: 'orders/getOrderList',
          payload: values,
        });
        this.setState({
          values: values,
        });
      }
    });
  }


  handleChange(value, key, column) {

    this.props.dispatch({
      type: 'orders/onHandleOrderChange',
      payload: {value: value, id: key, column: column}
    })
  }

  edit(key) {
    this.props.dispatch({
      type: 'orders/editOrderList',
      payload: key
    })
  }

  save(id) {
    const newData = this.props.orderList;
    this.props.dispatch({
      type: 'orders/updateOrderList',
      payload: {id: id, newData: newData}
    });
  }

  deleteOrder(id) {

    this.props.dispatch({
      type: 'orders/deleteOrder',
      payload: id
    });

    this.props.dispatch({
      type: 'orders/getOrderList',
      payload: this.state.values,
    });


  }

  cancel(key) {
    this.props.dispatch({
      type: 'orders/cancelOrderList',
      payload: key
    })
  }

  render() {
    const {getFieldDecorator, getFieldValue} = this.props.form;
    // 设置Table数据
    const dataSource = this.props.orderList;
    return (
      <div>
        <PageHeaderLayout title="订单管理">
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            layout="inline"
          >
            <div style={{marginBottom: 50}}>
              <FormItem
                label="输入用户手机号检索订单"
              >
                {getFieldDecorator('phoneNumber', {
                  rules: [{
                    required: true,
                    message: '请输入正确的手机号',
                    pattern: /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/,
                  }],
                })(
                  <Input style={{width: 140}}>

                  </Input>
                )}
              </FormItem>
              <FormItem>
                <Button style={{marginLeft: 20, marginRight: 20}} type="primary" htmlType="submit"
                        loading={this.props.loading}>Search</Button>
              </FormItem>
            </div>
          </Form>


          <Table
            pagination={{
              total: this.props.total,
              current: this.state.currentPage,
              onChange: (page) => {
                this.onChangePage(page)
              }
            }}
            scroll={{x: '140%'}}
            columns={this.columns}
            dataSource={dataSource}
            loading={this.props.loading}/>
        </PageHeaderLayout>
      </div>
    )
  }
}

