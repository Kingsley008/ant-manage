import {getCategory,getSubCategory,getProductByCategory,getProductByCategoryAndSubCategory,getAllProductByCategory,
getProductDetail} from '../services/goods';

export default {
  namespace: 'goods',
  state: {
    productList: [],
    categoryList: [],
    subCategoryList:[],
    productDetail:{},
    total_page:0,
    loading:false,
    visible:false,
    currentPage:1,
  },

  effects: {
    * fetchCategory(_, {call, put}){
      const response = yield call(getCategory);

      response.category.unshift('选择全部');
      yield put({
        type:'saveCategory',
        payload:response
      })
    },

    * fetchSubCategory({payload}, {call, put}) {
      const response = yield call(getSubCategory,payload);
      response.subCategory.unshift('选择全部');
      yield put({
        type:'saveSubCategory',
        payload:response.subCategory,
      });
    },

    * fetchProductByCategory({payload}, {call, put}) {
      yield put({
        type: 'addLoading',
      });
      let response = {};
      if(payload.category === '选择全部' && payload.subCategory === '选择全部'){
        response = yield call(getAllProductByCategory,payload);
      }else if(payload.subCategory === '选择全部' && payload.category !== '选择全部'){
        response = yield call(getProductByCategory,payload);
      }else if(payload.subCategory !== '选择全部' && payload.category !== '选择全部'){
        response = yield call(getProductByCategoryAndSubCategory,payload)
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
        type:'hideLoading',
      })

    },
    * fetchProductDetail({payload},{call, put}){
      yield put({
        type: 'addLoading',
      });

      const response = yield call(getProductDetail,payload);
      yield put({
        type: 'saveProductList',
        payload: response.productDetail,
      });

      yield put({
        type:'hideLoading',
      })
    }

  },

  reducers: {
    saveCategory(state, action){
      console.log(action.payload);
      return {
        ...state,
        categoryList:action.payload.category
      }
    },

    saveSubCategory(state, action) {
      return {
        ...state,
        subCategoryList:action.payload
      }
    },

    saveProductList(state, action) {
      return {
        ...state,
        productList: action.payload,
      };
    },


    addLoading(state){
      return{
        ...state,
        loading:true
      }
    },

    hideLoading(state){
      return{
        ...state,
        loading:false
      }
    },

    savePageCount(state, action) {
      return {
        ...state,
        total_page: action.payload
      }
    },

    changeProductFormVisibility(state, action){
      return{
        ...state,
        visible:action.payload
      }
    }
  },
};
