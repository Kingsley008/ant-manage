import React, {Component} from 'react';
import {connect} from 'dva';
import LzEditor from 'react-lz-editor';
import {Button, DatePicker, Form, Select, Table,Popconfirm,Modal, Input, message} from 'antd';

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
@connect((state) => ({
  htmlContent:state.goods.htmlContent
}))
@Form.create()
export  default  class ProductDetail extends Component {

  constructor(props){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.receiveHtml=this.receiveHtml.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      htmlContent: this.props.productDetail.text,
      responseList: []
    };
  }

  handleSubmit(){
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.text = this.props.htmlContent;
        console.log(values.text);
        this.props.dispatch({
          type: 'goods/updateProductDetail',
          payload: values,
        });
      }
    })
  }
  handleChange = (info) => {
    console.log(info);
    if (info.file.status === 'uploading') {
      console.log('loading');
      message.success(`文件上传中`);
    }

    if (info.file.status !== 'uploading') {
      // console.log(info.file, info.fileList);
    }

    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件成功上传`);
      this.setState({
        htmlContent: this.state.htmlContent + '<img src= "' + info.file.response.address + '" alt="test"/>'
      })
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
    this.setState({
      responseList: info.fileList,
    })

    // if(e.file.status == 'done'){
    //   this.setState({
    //     responseList: e.fileList,
    //     htmlContent: this.state.htmlContent +`<img src=${e.file.response.address} alt="test"/>`
    //   })
    // }

  };

  receiveHtml(content) {
    this.setState({
      htmlContent: content
    })
  }

  render(){
    const {getFieldDecorator} = this.props.form;
    const {responseList} = this.state;
    const uploadProps = {
      action: "http://localhost:8080/biyaoweb/uploadImage",
      onChange: this.handleChange,
      listType: 'picture',
      fileList: responseList,  //已经上传的文件列表
      data: (file) => {

      },
      multiple: true,
      beforeUpload: this.beforeUpload,
      showUploadList: true
    };

    if(this.props.productDetail){
      const {id,name,intro,catagory,subCatagory,sizes,newicon,colors,icon,price,text,imgs,produceDate } = this.props.productDetail;
      return(
        <Modal
          width={720}
          visible={this.props.visible}
          title="商品详情修改"
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
                  initialValue:id,
                  key:1
                }
                )(
                  <Input disable = 'true'  >
                  </Input>
                )}
              </FormItem>

              <FormItem
                label="商品名称"
                {...formItemLayout}
              >
                {getFieldDecorator('name', {
                  rules: [{
                    required: true, message: '请输入商品名称',
                  }],
                  initialValue:name}
                )(
                  <Input>
                  </Input>
                )}
              </FormItem>

              <FormItem
                label="商品介绍"
                {...formItemLayout}
              >
                {getFieldDecorator('intro', {
                  rules: [{
                    required: true, message: '请填写商品介绍',
                  }],
                  initialValue:intro,
                })(
                  <Input>
                  </Input>
                )}
              </FormItem>

              <FormItem
                label="生产时长"
                {...formItemLayout}
              >
                {getFieldDecorator('produceDate', {
                  rules: [{
                    required: true, message: '请填写生产时长',
                  }],
                  initialValue:produceDate,
                })(
                  <Input>
                  </Input>
                )}
              </FormItem>

              <FormItem
                label="新品标签"
                {...formItemLayout}
              >
                {getFieldDecorator('newicon', {
                  rules: [{
                    required: true, message: '请填写是否为新品',
                  }],
                  initialValue:newicon,
                })(
                  <Input>
                  </Input>
                )}
              </FormItem>

              <FormItem
                label="商品分类"
                {...formItemLayout}
              >
                {getFieldDecorator('catagory', {
                  rules: [{
                    required: true, message: '请输入商品分类',
                  }],
                  initialValue:catagory
                })(
                  <Input>
                  </Input>
                )}
              </FormItem>

              <FormItem
                label="商品子分类"
                {...formItemLayout}
              >
                {getFieldDecorator('subCatagory', {
                  rules: [{
                    required: true, message: '请填写商品子分类',
                  }],
                  initialValue:subCatagory
                })(
                  <Input>
                  </Input>
                )}
              </FormItem>

              <FormItem
                label="售价"
                {...formItemLayout}
              >
                {getFieldDecorator('price', {
                  rules: [{
                    required: true, message: '请填写商品售价',
                  }],
                  initialValue:price,
                })(
                  <Input>
                  </Input>
                )}
              </FormItem>

              <FormItem
                label="图片集"
                {...formItemLayout}
              >
                {getFieldDecorator('imgs', {
                  rules: [{
                    required: true, message: '请填写图片集',
                  }],
                  initialValue:imgs,
                })(
                  <Input>
                  </Input>
                )}
              </FormItem>

              <FormItem
                label="封面图片"
                {...formItemLayout}
              >
                {getFieldDecorator('icon', {
                  rules: [{
                    required: true, message: '请填写商品封面',
                  }],
                  initialValue:icon,
                })(
                  <Input>
                  </Input>
                )}
              </FormItem>

              <FormItem
                label="颜色"
                {...formItemLayout}
              >
                {getFieldDecorator('colors', {
                  rules: [{
                    required: true, message: '请填写颜色分类',
                  }],
                  initialValue:colors,
                })(
                  <Input>
                  </Input>
                )}
              </FormItem>

              <FormItem
                label="尺码"
                {...formItemLayout}
              >
                {getFieldDecorator('sizes', {
                  rules: [{
                    required: true, message: '请填写尺码分类',
                  }],
                  initialValue:sizes,
                })(
                  <Input>
                  </Input>
                )}
              </FormItem>

              <div style={{marginBottom:'10px'}}>商品详情页设置
              </div>

              <LzEditor active={true} importContent={this.props.productDetail.text} cbReceiver={this.receiveHtml} uploadProps={uploadProps}
                        lang="en"/>
            </div>
          </Form>
        </Modal>
      )
    }
  }
}
