import React, {Component} from 'react';
import {connect} from 'dva';
import {Button, DatePicker, Form, Select, Table,Popconfirm} from 'antd';
import {routerRedux} from 'dva/router';
import {total} from "../../components/Charts/Pie/index";
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const FormItem = Form.Item;

const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: '1',
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    key: '2',
  },
  {
    title: '商品图片',
    dataIndex: 'icon',
    key: '4',
    render:(value)=>{
      console.log(value);
      return (
        <div>
          <img src={value} style={{display:'inline-block', height:'100px', width:'100px',zoom:'1',border:'1px solid black'}}></img>
        </div>
      )
    }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 7,
    render: (text, record) => {

      return (
        <div className="editable-row-operations">
          {
            <span>
              <a onClick={() => this.edit(record.id)} style={{marginRight: 10}}>详情</a>
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
  }
];


@connect((state) => ({
  productList: state.goods.productList,
  categoryList: state.goods.categoryList,
  subCategoryList: state.goods.subCategoryList,
  total: state.goods.total_page,
  userName: state.login.userName,
  loading: state.goods.loading,
}))

// TODO 分页
@Form.create()
export default class FlowTableThree extends Component {
  constructor(props) {
    super(props);
    if (this.props.userName === null) {
      this.props.dispatch({
        type: 'login/invalidLogin'
      })
    }

    this.props.dispatch({
      type: 'goods/fetchCategory',
    });
    this.onChangePage = this.onChangePage.bind(this);
    this.state = {
      currentPage: 1,
    };
    this.getSubCategory = this.getSubCategory.bind(this);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);

        this.props.dispatch({
          type: 'goods/fetchProductByCategory',
          payload: values,
        });

        this.setState({
          values: values,
        });

      }
    });

  };

  onChangePage(pageNumber) {
    this.state.values.currentPage = pageNumber;
    this.state.currentPage = pageNumber;
    this.props.dispatch({
      type: 'goods/fetchFlowById',
      payload: this.state.values,
    });
  }

  getSubCategory(option){
    this.props.dispatch({
      type:'goods/fetchSubCategory',
      payload:option
    })
  }
  // 处理表单提交
  render() {
    const {submitting} = this.props;
    const {getFieldDecorator, getFieldValue} = this.props.form;
    // 设置CrossID
    let categoryList = this.props.categoryList || [];
    let categoryOption = <Option key={1}>数据请求中</Option>;
    let subCategoryOption = <Option key={1}>全部分类</Option>;
    let subCategoryList = this.props.subCategoryList || [];

    if (categoryList != 0) {
      categoryOption = categoryList.map(id => <Option key={id}>{id}</Option>);
    }

    if(subCategoryList != 0) {
      subCategoryOption = subCategoryList.map(id => <Option key={id}>{id}</Option>)
    }

    // const laneOption = this.props.laneNo.map(i => <Option key={i}>{i}</Option>);

    // 设置Table数据
    const dataSource = [];
    let orginalSource = this.props.productList;
    orginalSource.forEach((v, i) => {
      let obj = {
        key: i,
        id: v.id,
        name: v.name,
        icon: 'http://localhost:8080/biyaoweb/'+v.icon,
        price: v.price,
      };
      dataSource.push(obj)
    });


    return (
      <div>
        <PageHeaderLayout title="商品管理" content="">
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            layout="inline"
          >
            <div style={{marginBottom: 50}}>
              <FormItem
                label="商品分类"
              >
                {getFieldDecorator('category', {
                  rules: [{
                    required: true, message: '请输入商品类目',
                  }],
                })(
                  <Select style={{width: 120}} onSelect={this.getSubCategory}>
                    {categoryOption}
                  </Select>
                )}
              </FormItem>

              <FormItem>
                <FormItem
                  label="商品子分类"
                >
                  {getFieldDecorator('subcategory', {
                    rules: [{
                      required: true, message: '请输入子分类',
                    }],
                  })(
                    <Select style={{width: 120}} >
                      {subCategoryOption}
                    </Select>
                  )}
                </FormItem>
              </FormItem>

              <FormItem>
                <Button style={{marginLeft: 20, marginRight: 20}} type="primary" htmlType="submit"
                        loading={this.props.loading}>Search</Button>
              </FormItem>
            </div>
            <Button type ="primary" style ={{marginBottom:'10px'}}>添加新的产品</Button>
          </Form>
          <Table
            pagination={{
              total: this.props.total,
              current: this.state.currentPage,
              onChange: (page) => {
                this.onChangePage(page)
              }
            }}
            columns={columns}
            dataSource={dataSource}
            loading={this.props.loading}/>
        </PageHeaderLayout>
      </div>
    )
  }
}
