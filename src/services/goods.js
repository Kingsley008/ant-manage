import request from '../utils/request';

const key = 'http://localhost:8080/biyaoweb';

// export async function alterUsersData(payload) {
//
//   let myHeaders = new Headers();
//   myHeaders.append('Content-Type', 'application/json');
//   delete payload.editable;
//   payload.password = md5(payload.password);
//
//   return request(`${key}/updateUser`, {
//     headers:myHeaders,
//     method:'POST',
//     mode:'cors',
//     body:payload,
//   })
//
// }

export async function getCategory(payload) {

  return request(`${key}/getCategory`, {
    method: 'GET',
    mode: 'cors',
  })

}

export async function getSubCategory(payload) {

  return request(`${key}/getSubCategory?category=${payload}`, {
    method:'GET',
    mode:'cors',
  })

}


export async function getProductByCategory(payload) {
  return request(`${key}/getProductsByCategory?category=${payload.category}`, {
    method:'GET',
    mode:'cors',
  })
}

export async function getProductByCategoryAndSubCategory(payload) {
  return request(`${key}/getProductsByCategoryAndSub?category=${payload.category}&subCategory=${payload.subCategory}`, {
    method:'GET',
    mode:'cors',
  })
}

