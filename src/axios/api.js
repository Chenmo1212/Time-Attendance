import {api} from "./fetch"

//注册
export function regTo(phone, reg_pwd) {
  console.log('开始post');
  return api.post('api/v1/user/register',
    {
      username: phone,
      password: reg_pwd
    }
  )
}

//登陆
export function login(login_acc, login_pwd) {
  console.log('登陆接口');
  return api.post('/api/v1/user/login', {
    username: login_acc,
    password: login_pwd
  })
}


//新建考勤
export function postList(a, creatListKey) {

  console.log('新建考勤', a);
  return api.post('/api/v1/checkin/new', a, {
    headers: {
      'X-Auth-Key': creatListKey
    }
  })
}

//疯狂刷新签到人员
export function getchick(id) {
  //获取key
  const key = localStorage.getItem('creatListKey');

  return api.post('/api/v1/checkin/status', {id}, {
      headers: {
        'X-Auth-Key': key
      },

    }
  )
}

//未注册状态下获取匿名用户
export function anonymous() {
  return api.get('/api/v1/user/anonymous')
}

//获取用户所创建的考勤
export function getchickin() {
  //获取key
  const result = localStorage.getItem('result.data.body.key');
  console.log('key', result);
  return api.get('/api/v1/user/checkin', {
    headers: {
      'X-Auth-Key': result
    }
  })

}

//获取用户信息
export function getInfo() {
  //获取key
  return api.get('/api/v1/user/info', {
    headers: {
      'X-Auth-Key': result
    }
  })
}

//获取用户的脸
export function getFace(id,gid,code) {
  //获取key
  const key = localStorage.getItem('creatListKey');
  return api.post('/api/v1/checkin/spec', {
    id:id,
    gid:gid,
    code:code,
  }, {
    headers: {
      'X-Auth-Key': key
    }
  })
}
