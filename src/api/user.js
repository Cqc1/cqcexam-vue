import request from '@/utils/axios'


export function login(params) {
  return request({
    url: '/api/login',
    method: 'post',
    data:params
  })
}
export function logout(params) {
  return request({
    url: '/api/logout',
    method: 'get',
    data:params
  })
}


export function removeStudent(params) {
  return request({
    url: '/api/student/params',
    method: 'get',
    data:params
  })
}

export function getTeacherInfo(reqData) {
  return request({
    url:'/user/list/get',
    method: 'get',
    data: reqData
  })
}

export function getStudentInfo(reqData) {
  return request({
    url:'/studengt/${this.reqData}',
    method: 'get',
    data: reqData
  })
}


