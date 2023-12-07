import request from '@/utils/request'

export function getList(params) {
  return request({
    url: `/api/employee`,
    method: 'get',
    params
  })
}

export function remove(params) {
  return request({
    url: `/api/employee`,
    method: 'get',
    params
  })
}

