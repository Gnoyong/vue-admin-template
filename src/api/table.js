import request from '@/utils/request'
var qs = require('qs')

export function insert(data) {
  return request({
    url: `/employee`,
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: `/employee`,
    method: 'put',
    data
  })
}

export function get(params) {
  return request({
    url: `/employee/${params}`,
    method: 'get'
  })
}

export function getList(params) {
  return request({
    url: `/employee`,
    method: 'get',
    params
  })
}

export function remove(params) {
  return request({
    url: `/employee`,
    method: 'delete',
    params,
    paramsSerializer: (params) => {
      return qs.stringify(params, { indices: false })
    }
  })
}

