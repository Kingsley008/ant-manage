import request from '../utils/request';

const key = 'http://localhost:8080/biyaoweb';

export async function getOrderList(payload) {

  return request(`${key}/getOrderList?currentPage=${payload.currentPage}&phoneNumber=${payload.phoneNumber}`,{
    method:'GET',
    mode:'cors',
  })

}
