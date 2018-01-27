import {message} from 'antd';
import {getOrderList, deleteOrder, updateOrder} from "../services/orders"

export default {
  namespace:'orders',
  state:{
    orderList:[],
    loading:false,
    visible:false,
    totalCount:0,
    orderListCache:[],
  },
  effects:{
    * getOrderList({payload},{call, put}){
      yield put({
        type:'changeLoading',
        payload:true
      });

      const result =  yield  call(getOrderList,payload);

      yield put({
        type:'saveOrderList',
        payload:result.orderList,
      });

      yield put({
        type:'saveTotalPage',
        payload:result.totalCount,

      });
      yield put({
        type:'changeLoading',
        payload:false
      })
    },
    * deleteOrder({payload},{call, put}){
      yield put({
        type:'changeLoading',
        payload:true,
      });
      const result =  yield call(deleteOrder,payload);
      if(result.message == 'ok'){
          message.success('删除成功')
      }else{
          message.error('删除失败')
      }
      yield put({
        type:'changeLoading',
        payload:false,
      })
    },

    * updateOrderList({payload}, {call, put}) {
      const target = payload.newData.filter(item => payload.id === item.id)[0];
      if (target) {
        yield put({
          type:'changeLoading',
          payload:true,
        });
        console.log('up ',target);
        // 修改
        const result =  yield call(updateOrder, target);
        console.log(result);
      }

      yield put({
        type: 'saveOrderListLocal',
        payload: payload.id
      });

      yield put({
        type:'changeLoading',
        payload:false,
      })

    },
  },
  reducers:{
    saveOrderList(state, action) {
      let temp = [];
      action.payload.forEach((v)=>{
        temp.push(Object.assign({},v))
      });

      return {
        ...state,
        orderList: action.payload,
        orderListCache:temp,
      }

    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload
      }
    },
    saveTotalPage(state, action) {
      return {
        ...state,
        totalCount:action.payload
      }
    },
    editOrderList(state, {payload}) {
      const newData = [...state.orderList];
      const target = newData.filter(item => payload === item.id)[0];
      if (target) {
        target.editable = true;
        return {
          ...state,
          orderList: newData
        }
      } else {
        return ({...state});
      }
    },
    // 修改的数据 保存到状态管理
    saveUsersListLocal(state, {payload}) {

      const newData = [...state.orderList];
      const target = newData.filter(item => payload === item.id)[0];

      if (target) {
        delete target.editable;
        const cacheData = newData.map(item => ({...item}));
        return ({...state, orderList: newData, orderListCache: cacheData});
      } else {
        return ({...state});
      }
    },

    // 处理修改 input 事件的逻辑
    onHandleOrderChange(state, {payload}) {
      const newData = [...state.orderList];
      const target = newData.filter(item => payload.id === item.id)[0];
      if (target) {
        target[payload.column] = payload.value;
        return ({...state, orderList: newData});
      } else {
        return ({...state});
      }
    },

    // 取消的修改的逻辑
    cancelOrderList(state, {payload}) {
      const newData = [...state.orderList];
      const target = newData.filter(item => payload === item.id)[0];
      if (target) {
        // 取消-回退缓存
        Object.assign(target, state.orderListCache.filter(item => payload === item.id)[0]);
        delete target.editable;
        return ({...state, orderList: newData});
      } else {
        return ({...state});
      }
    }

  }

}
