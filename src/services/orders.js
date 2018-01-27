import request from '../utils/request';

const key = 'http://localhost:8080/biyaoweb';

export async function getOrderList(payload) {

  return request(`${key}/getOrderListAdmin?currentPage=${payload.currentPage}&phoneNumber=${payload.phoneNumber}`,{
    method:'GET',
    mode:'cors',
  })

}

export async function deleteOrder(payload) {
  return request(`${key}/deleteOrder?id=${payload}`)
}

export async function updateOrder(payload) {

  let myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  delete payload.editable;

  return request(`${key}/updateOrder`, {
    headers:myHeaders,
    method:'POST',
    mode:'cors',
    body:payload,
  })
}
