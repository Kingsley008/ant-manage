import request from '../utils/request';
const key = 'http://localhost:8080/biyaoweb';
import md5 from 'js-md5';

// export async function queryTotalFlow(payload) {
//   let myHeaders = new Headers();
//   myHeaders.append('Content-Type', 'application/json');
//   return request(`${key}/v1/carflow/cross/summary`,{
//     method:'POST',
//     mode:'cors',
//     credentials:'',
//     body:payload,
//     headers:myHeaders,
//     cache:'default',
//   })
// }

export async function queryUsersData(payload) {
  console.log(payload);
  return request(`${key}/showUserList?currentPage=${payload}`,{
    method:'GET',
    mode:'cors',
  });

}

export async function alterUsersData(payload) {

  let myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  delete payload.editable;
  payload.password = md5(payload.password);

  return request(`${key}/updateUser`, {
    headers:myHeaders,
    method:'POST',
    mode:'cors',
    body:payload,
  })
}

export async function addUsersData(payload) {
  let myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  delete payload.editable;

  return request(`${key}/addUserAdmin`, {
    headers:myHeaders,
    method:'POST',
    mode:'cors',
    body:payload,
  })
}


export async function deleteUsersData(payload) {

  return request(`${key}/deleteUser?id=${payload}`,{
    method:'GET',
    mode:'cors',
  })

}


