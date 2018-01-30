import {
  deleteProduct,
  getAllProductByCategory,
  getCategory,
  getProductByCategory,
  getProductByCategoryAndSubCategory,
  getProductDetail,
  getSubCategory,
  updateProductDetail,
  addNewProduct,
} from '../services/goods';
import {message} from 'antd';

export default {
  namespace: 'goods',
  state: {
    productList: [],
    categoryList: [],
    subCategoryList: [],
    productDetail: {},
    total_page: 0,
    loading: false,
    visible: false,
    currentPage: 1,
    visible_new: false,
    htmlContent: `<h1>Yankees, Peeking at the Red Sox, Will Soon Get an Eyeful</h1>`
  },

  effects: {
    * fetchCategory(_, {call, put}) {
      const response = yield call(getCategory);

      response.category.unshift('选择全部');
      yield put({
        type: 'saveCategory',
        payload: response
      })
    },

    * fetchSubCategory({payload}, {call, put}) {
      const response = yield call(getSubCategory, payload);
      response.subCategory.unshift('选择全部');
      yield put({
        type: 'saveSubCategory',
        payload: response.subCategory,
      });
    },

    * fetchProductByCategory({payload}, {call, put}) {
      yield put({
        type: 'addLoading',
      });
      let response = {};
      if (payload.category === '选择全部' && payload.subCategory === '选择全部') {
        response = yield call(getAllProductByCategory, payload);
      } else if (payload.subCategory === '选择全部' && payload.category !== '选择全部') {
        response = yield call(getProductByCategory, payload);
      } else if (payload.subCategory !== '选择全部' && payload.category !== '选择全部') {
        response = yield call(getProductByCategoryAndSubCategory, payload)
      }

      yield put({
        type: 'saveProductList',
        payload: response.productList,
      });

      yield put({
        type: 'savePageCount',
        payload: response.totalCount,
      });

      yield put({
        type: 'hideLoading',
      })

    },
    * fetchProductDetail({payload}, {call, put}) {
      yield put({
        type: 'addLoading',
      });

      const response = yield call(getProductDetail, payload);
      console.log(response);

      yield put({
        type: 'saveProductDetail',
        payload: response.productDetail,
      });

      yield put({
        type: 'hideLoading',
      })
    },

    * updateProductDetail({payload}, {call, put}) {
      yield put({
        type: 'addLoading',
      });
      const result = yield call(updateProductDetail, payload);
      if (result.message == 1) {

        yield put({
          type: 'hideLoading',
        });

        yield put({
          type: 'changeProductFormVisibility',
          payload: false
        });

        message.success('更新成功');

        const result = yield call(queryUsersData, payload);
        console.log(result);
        yield put({
          type: 'getUsersListLocal',
          payload: result,
        });

      } else {
        message.success('提交失败');
        yield put({
          type: 'hideLoading',
        });
      }
    },

    * deleteProduct({payload}, {call, put}) {
      const result = yield call(deleteProduct, payload);

      if (result.message === 1) {
        message.success('删除成功');
      } else {
        message.fail('删除失败');
      }

    },

    * addNewProduct({payload},{call, put}) {
      console.log(payload);
      const result = yield call(addNewProduct, payload);
      console.log(result);
      if(result.message == 1){
        message.success('添加成功');
        yield put({
          type:'changeNewProductFormVisibility',
          payload:false
        })
      }else{
        message.error('添加失败')
      }


    }

  },

  reducers: {
    saveCategory(state, action) {

      return {
        ...state,
        categoryList: action.payload.category
      }
    },

    saveSubCategory(state, action) {
      return {
        ...state,
        subCategoryList: action.payload
      }
    },

    saveProductList(state, action) {
      return {
        ...state,
        productList: action.payload,
      };
    },

    saveProductDetail(state, action) {
      return {
        ...state,
        productDetail: action.payload
      }
    },
    addLoading(state) {
      return {
        ...state,
        loading: true
      }
    },

    hideLoading(state) {
      return {
        ...state,
        loading: false
      }
    },

    savePageCount(state, action) {
      return {
        ...state,
        total_page: action.payload
      }
    },

    changeProductFormVisibility(state, action) {
      return {
        ...state,
        visible: action.payload
      }
    },

    changeNewProductFormVisibility(state, action) {
      console.log(action);
      return {
        ...state,
        visible_new:action.payload
      }
    },

    saveHtmlContent(state, action) {
      return {
        ...state,
        htmlContent: action.payload
      }
    }
  },
};
