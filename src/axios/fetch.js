import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://exam.m.cust.edu.cn/quickauth/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10 * 1000
});

//
// //设置拦截器
// api.interceptors.response.use(
//   (response) => {
//     console.log('拦截器:请求成功', response)
//     return response
//   }, (error) => {
//     console.log('拦截器:发生错误', error.response)
//     return Promise.reject(error)
//   }
// )
//
