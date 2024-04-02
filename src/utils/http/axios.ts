/* eslint-disable new-cap */
import axios from 'axios'
// import { AxiosRequestConfig, AxiosResponse } from 'axios'
// import { ElMessage } from 'element-plus'


/**
 * 通过修改 .env 和 .env.development 文件以修改前缀
 */
export const baseURL = ''

export const tokenKey = 'token'

// 创建axios实例
// 创建实例时配置默认值
const service = axios.create({
  baseURL,
  withCredentials: false
})
// 创建实例后修改默认值
//修改标头
service.defaults.headers.common['Authorization'] = 'bearer 922ccb16-60d1-4268-8362-55fb155c3c79';
export default service
