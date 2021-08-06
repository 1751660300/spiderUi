import request from '@/utils/myRequest'

export function settingDetails(params) {
  return request({
    url: '/settings/getSettingDetail',
    method: 'get',
    params
  })
}

export function mergeSettingDetail(params) {
  return request({
    url: '/settings/mergeSettingDetail',
    method: 'post',
    params
  })
}

export function delSettingDetail(params) {
  return request({
    url: '/settings/delSettingDetail',
    method: 'post',
    data: params
  })
}

export function settings(params) {
  return request({
    url: '/settings/getSettings',
    method: 'get',
    params
  })
}

export function editSetting(params) {
  return request({
    url: '/settings/mergeSetting',
    method: 'post',
    params
  })
}
