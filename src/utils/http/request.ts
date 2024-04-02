/*
 * @Author: hjw
 * @Date: 2023-02-13 09:27:26
 * @LastEditTime: 2023-03-14 17:03:14
 * @LastEditors: hjw
 * @Description: 
 * @FilePath: \mtxy-web-view-bigdata\src\utils\http\request.ts
 */
import axios from './axios'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { AxiosResponse } from 'axios'
import { cloneDeep, omit, assign } from 'lodash-es'


// get默认请求
export function get(apiUrl: string, params?: any): Promise<any> {
  let paramsData = {}
  if (params && params.page && params.pageSize) {
    const data = cloneDeep(params)
    const pager = {
      page: data.page,
      pageSize: data.pageSize
    }
    const pagerParams = { pager: JSON.stringify(pager) }

    const remainderParams = omit(data, ['page', 'pageSize', 'options'])
    paramsData = assign(pagerParams, data.options, remainderParams)
  } else {
    paramsData = params
  }
  return axios.get(apiUrl, { params: paramsData })
 // return axios.get('/api'+apiUrl, { params: paramsData })
}

// post默认请求
export function post(apiUrl: string, params?: any, objParams?: any): Promise<any> {
  let postData = {}
  if (params && params.page && params.pageSize) {
    const data = cloneDeep(params)
    const pager = {
      page: data.page,
      pageSize: data.pageSize
    }
    const pagerParams = { pager: pager }

    const remainderParams = omit(data, ['page', 'pageSize', 'options'])
    postData = assign(pagerParams, { options: data.options }, remainderParams)
  } else {
    postData = params
  }
  return axios.post(apiUrl, postData, objParams)
 // return axios.post('/api'+apiUrl, postData)
}

// put默认请求
export function put(apiUrl: string, params?: any): Promise<any> {
   return axios.put(apiUrl, params)
  //return axios.put("/api"+apiUrl, params)
}

// delete默认请求
export function del(apiUrl: string, params?: any): Promise<any> {
   return axios.delete(apiUrl, { data: params })
  //return axios.delete("/api"+apiUrl, { data: params })
}
