import React, {Component} from 'react';
import {connect} from 'dva';
import LzEditor from 'react-lz-editor';
import {Button,message, Form,Modal, Input} from 'antd';

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

}))
@Form.create()
export  default  class NewProductDetail extends Component {

  constructor(props){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
      this.state = {
        htmlContent: `<h1>text</h1>`,
        responseList: []
      };
  }

  handleSubmit(){
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.text = this.state.htmlContent;
        this.props.dispatch({
          type: 'goods/updateProductDetail',
          payload: values,
        });
      }
    })
  }

  handleChange = (info)=>{
    console.log(info);
    if (info.file.status === 'uploading') {
      console.log('loading');
    }

    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }

    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }

    // if(e.file.status == 'done'){
    //   this.setState({
    //     responseList: e.fileList,
    //     htmlContent: this.state.htmlContent +`<img src=${e.file.response.address} alt="test"/>`
    //   })
    // }

  };

  receiveHtml(content) {
    console.log(content);
    this.setState({
      htmlContent:content
    })
  }

  render(){
    const {getFieldDecorator} = this.props.form;
    const { previewVisible, previewImage, responseList } = this.state;

    const uploadProps = {
      action: "http://localhost:8080/biyaoweb/uploadImage", // 上传的地址
      onChange: this.handleChange, // 上传文件改变时的状态
      listType: 'picture', // 上传样式
      fileList: responseList,  //已经上传的文件列表
      data: (file) => {
      // 上传所需参数或返回上传参数的方法
      },
      multiple: true,
      showUploadList: true
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
                  initialValue:0,
                })(
                  <Input disable="true">
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
                })(
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
                })(
                  <Input>
                  </Input>
                )}
              </FormItem>

              <FormItem
                label="图片集"
                {...formItemLayout}
              >
                {getFieldDecorator('price', {
                  rules: [{
                    required: true, message: '请填写图片集',
                  }],
                })(
                  <Input >
                  </Input>
                )}
              </FormItem>

              <FormItem
                label="封面图片"
                {...formItemLayout}
              >
                {getFieldDecorator('price', {
                  rules: [{
                    required: true, message: '请填写商品封面',
                  }],
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
                })(
                  <Input >
                  </Input>
                )}
              </FormItem>

              <div style={{marginBottom:'10px'}}>商品详情页设置
              </div>
              <LzEditor active={true} importContent={this.state.htmlContent}  cbReceiver={this.receiveHtml} lang="cn"  uploadProps={uploadProps} />
            </div>
          </Form>
        </Modal>
      )
    }
}
