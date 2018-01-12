import {getCategory,getSubCategory,getProductByCategory,getProductByCategoryAndSubCategory} from '../services/goods';

export default {
  namespace: 'goods',
  state: {
    productList: [],
    categoryList: [],
    subCategoryList:[],
    total_page:0,
    loading:false,
    currentPage:1,
  },

  effects: {
    * fetchCategory(_, {call, put}){
      const response = yield call(getCategory);
      console.log(response);
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

      const response = yield call(getProductByCategory,payload);

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
      state.total_page = 0;
      console.log(action);
      return {
        ...state,
        total_page: action.payload
      }
    },
  },
};
