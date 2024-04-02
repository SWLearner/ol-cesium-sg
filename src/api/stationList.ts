import { get, post } from '../utils/http/request'


// 获取用户信息
export function getUserInfo() {
    return get('/mtxy-system-service/v1/home/userinfo')
}
// 获取菜单
export interface systemId {
    systemId: number
}

export function getNavData(params: systemId) {
    return get('/mtxy-system-service/v1/home/menu/' + params.systemId)
}
//获取资源布局
export function layoutView(pathId: any) {
    return get(`/mtxy-system-service/v1/resource-layout-view/resource-layout-view?pathId=${pathId}`)
    // return get(`/mtxy-system-service/v1/resource-layout-view/resource-layout-view/${pathId}`)
}

//获取基站数据
export function getStationDataNew(params: any) {
    return post('/mtxy-statistics-service/v1/statistics/station/list', params)
}
//获取基站分组数据
export function getGroupNameList() {
    return get('/mtxy-statistics-service/v1/statistics/station/group-name-list')
}

//获取基站汇总数据
export function getStationTotal(params:any) {
    return post('/mtxy-statistics-service/v1/statistics/station/total', params)
}
//获取所有图标
export function getAllIcon() {
    return get(`/mtxy-regulate-service/v1/icon-web/all-icon-web/`, {})
}
//根据范围获取图标
export function getStationArea(params:any) {
    return post( '/mtxy-statistics-service/v1/statistics/station/area',params)
  }