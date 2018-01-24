import { message } from 'antd';
import { alterUsersData, deleteUsersData,queryUsersData, addUsersData } from '../services/users.js';

export default {
  namespace: 'users',
  state: {
    loading: false,
    usersList: [],
    usersListCache: [],
    visible:false,
  },
  effects: {

    * getUsersList({payload}, {call, put}) {
      const result = yield call(queryUsersData,payload);
      yield put({
        type: 'getUsersListLocal',
        payload: result.userList,
      });
      yield put({
        type:'getTotalCount',
        payload: result.totalCount,
      })
    },

    * submitUsersForm({payload}, {call, put}) {
      yield put({
        type: 'changeUsersFormSubmitting',
        payload: true
      });

      const result =  yield call(addUsersData, payload);

      if(result.message == 1 ){
        yield put({
          type: 'changeUsersFormSubmitting',
          payload: false
        });
        yield put({
          type: 'changeUsersFormVisibility',
          payload: false
        });
        message.success('提交成功');
        let currentPage = 1;

        const result = yield call(queryUsersData,currentPage);
        console.log(result);
        yield put({
          type: 'getUsersListLocal',
          payload: result,
        });

      } else {
        message.success('提交失败');
      }
    },

    // 修改保存同步到数据库
    * saveUsersList({payload}, {call, put}) {

      const target = payload.newData.filter(item => payload.id === item.id)[0];

      if (target) {
        yield put({
          type: 'changeUsersFormSubmitting',
          payload: true
        });
         yield call(alterUsersData, target);
      }

      yield put({
        type: 'saveUsersListLocal',
        payload: payload.id
      });

      yield put({
        type: 'changeUsersFormSubmitting',
        payload: false
      });

    },
    * deleteUsers({payload},{call, put}){
      yield put({
        type: 'changeUsersFormSubmitting',
        payload: true
      });
      yield call(deleteUsersData,payload);

      yield put({
        type: 'changeUsersFormSubmitting',
        payload: false
      });
    }
  },
  reducers: {

    getTotalCount(state,{payload}){
        return {
          ...state,
          totalCount:payload
        }
    },
    changeUsersFormSubmitting(state, {payload}) {
      return {
        ...state,
        loading: payload,
      };
    },
    changeUsersFormVisibility(state,{payload}) {
      return {
        ...state,
        visible:payload
      }
    },
    getUsersListLocal(state, {payload}) {
      let temp = [];
      payload.forEach((v)=>{
        temp.push(Object.assign({},v))
      });

      return {
        ...state,
        usersList: payload,
        usersListCache:temp
      }
    },

    editUsersList(state, {payload}) {
      const newData = [...state.usersList];
      const target = newData.filter(item => payload === item.id)[0];
      if (target) {
        target.editable = true;
        return {
          ...state,
          usersList: newData
        }
      } else {
        return ({...state});
      }
    },
    // 修改的数据 保存到状态管理
    saveUsersListLocal(state, {payload}) {

      const newData = [...state.usersList];
      const target = newData.filter(item => payload === item.id)[0];

      if (target) {
        delete target.editable;
        const cacheData = newData.map(item => ({...item}));
        return ({...state, usersList: newData, usersListCache: cacheData});
      } else {
        return ({...state});
      }
    },

    // 处理修改 input 事件的逻辑
    onHandleUsersChange(state, {payload}) {
      const newData = [...state.usersList];
      const target = newData.filter(item => payload.id === item.id)[0];
      if (target) {
        target[payload.column] = payload.value;
        return ({...state, usersList: newData});
      } else {
        return ({...state});
      }
    },

    // 取消的修改的逻辑
    cancelUsersList(state, {payload}) {
      const newData = [...state.usersList];
      const target = newData.filter(item => payload === item.id)[0];
      if (target) {
        // 取消-回退缓存
        Object.assign(target, state.usersListCache.filter(item => payload === item.id)[0]);
        delete target.editable;
        return ({...state, usersList: newData});
      } else {
        return ({...state});
      }

    }

  }
}
