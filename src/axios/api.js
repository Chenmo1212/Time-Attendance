import {api} from "./fetch"
// 获取图片
export function works(username) {
  return api.post('/v1/teacher/works_to_rate',{
    "token": "yzrtzJVtbfYg7A1G18E57vde"
  })
}

//码
export function get_code() {
  return api.get()
}

//学生
export function get_stu() {
  return api.get()
}


