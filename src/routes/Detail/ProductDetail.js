import React, {Component} from 'react';
import {connect} from 'dva';
import LzEditor from 'react-lz-editor';
import {Button, DatePicker, Form, Select, Table,Popconfirm,Modal, Input} from 'antd';


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
const FormItem = Form.Item;
@Form.create()
export  default  class ProductDetail extends Component {

  constructor(props){
    super(props);
    this.state = {
      htmlContent: `<h1>Yankees, Peeking at the Red Sox, Will Soon Get an Eyeful</h1>
                <p>Whenever Girardi stole a glance, there was rarely any good news for the Yankees. While Girardi’s charges were clawing their way to a split of their four-game series against the formidable Indians, the Boston Red Sox were plowing past the rebuilding Chicago White Sox, sweeping four games at Fenway Park.</p>`,
      markdownContent: "## HEAD 2 \n markdown examples \n ``` welcome ```",
      responseList: []
    };
    this.receiveHtml=this.receiveHtml.bind(this);
  }

  receiveHtml(content) {
    console.log("recieved HTML content", content);
    this.setState({responseList:[]});
  }


  render(){
    const {loading, visible} = this.props;
    const {getFieldDecorator} = this.props.form;
    const uploadProps = {
      action: "http://v0.api.upyun.com/devopee",
      onChange: this.onChange,
      listType: 'picture',
      fileList: this.state.responseList,
      data: (file) => {

      },
      multiple: true,
      beforeUpload: this.beforeUpload,
      showUploadList: true
    };
    const style = {
      width:'720px'
    };
    return(
      <Modal
        width={720}
        visible={this.props.visible}
        title="添加新的产品"
        onCancel={this.props.handleCancel}
        footer={[
          <FormItem>
            <Button key="back" onClick={this.props.handleCancel}>返回</Button>,
            <Button key="submit" htmlType="submit" type="primary" loading={this.props.loading} onClick={this.handleSubmit}>
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
              label="Id"
              {...formItemLayout}
            >
              {getFieldDecorator('id', {
                rules: [{
                  required: true,
                }],
              })(
                <Input disable = {true} value = {0} >
                </Input>
              )}
            </FormItem>

            <FormItem
              label="商品名称"
              {...formItemLayout}
            >
              {getFieldDecorator('password', {
                rules: [{
                  required: true, message: '请输入商品名称',
                }],
              })(
                <Input>
                </Input>
              )}
            </FormItem>

            <FormItem
              label="商品分类"
              {...formItemLayout}
            >
              {getFieldDecorator('address', {
                rules: [{
                  required: true, message: '请输入商品分类',
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

            <div>Editor demo 1 (use default html format ):
            </div>
            <LzEditor active={true} importContent={this.state.htmlContent} cbReceiver={this.receiveHtml} uploadProps={uploadProps}
                      lang="en"/>
          </div>
        </Form>
      </Modal>
    )
  }
}
