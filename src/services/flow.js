import request from '../utils/request';

const key = 'http://localhost:8080/biyaoweb';

export async function accountLogin(payload) {
  console.log(payload);
  return request(`${key}/admin?userName=${payload.userName}&password=${payload.password}`, {
    method:'GET',
    mode:'cors',
    body:payload
  })
}

export async function queryCurrent(payload) {

  return request(`${key}/v1/user/currentUser`,{
    method:'GET',
    mode:'cors',
    credentials: "",
  });
}
// 命名有点问题 这个查倒数几条
export async function queryLaneLastMinutes(payload) {

  return request(`${key}/v1/carflow/cross/${payload.cross_id}/lane/${payload.lane}/last/${payload.last}`,{
    method:'GET',
    mode:'cors',
    credentials: "",
    cache: 'default',
  });
}

// 查倒数几分钟
export async function queryLaneAndLastMinutes(payload) {
  return request(`${key}/v1/carflow/cross/${payload.cross_id}/lane/${payload.lane}/last_minutes/${payload.last_minutes}`,{
    method:'GET',
    mode:'cors',
    credentials: "",
    cache: 'default',
  })
}

export async function queryAllCrossID() {

  return request(`${key}/v1/carflow/allcrossid`,{
    method:'GET',
    mode:'cors',
    credentials: "",
    cache: 'default',
  });

}


export async function queryRangeByLaneAndTime(payload) {

  return request(`${key}/v1/carflow/cross/${payload.cross_id}/lane/lanestart=${payload.lane_start}&laneend=${payload.lane_end}/start=${payload.time_start}&end=${payload.time_end}/${payload.currentPage}`,{
    method:'GET',
    mode:'cors',
    credentials: "",
    cache: 'default',
  });
}

///cross/:id/start=:timestart&end=:timeend/:page
export async function queryRangeById(payload) {
  return request(`${key}/v1/carflow/cross/${payload.cross_id}/start=${payload.time_start}&end=${payload.time_end}/${payload.currentPage}`, {
    method:'GET',
    mode:'cors',
    credentials: "",
    cache: 'default',
  })
}

// 根据cross_id 查询 所有的laneNo
export async function findLaneNoById(payload) {
  return request(`${key}/v1/carflow/getlane/${payload}`, {
    method:'GET',
    mode:'cors',
    credentials:'',
    cache:'default',
  })
}



