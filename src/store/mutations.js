export default {
  change(state, lists) {
    console.log('--------------------------------------');
    console.log('数据接收：');
    console.log('班级情况为：', lists);
    state.Class_lists = lists;
    console.log('给仓库的值赋值：');
    console.log('仓库的值已赋值为：', state.Class_lists);
    console.log('--------------------------------------');
  },

  // 更改loading
  SET_LOADING(state, obj) {
    state.isLoading = obj.isLoading;
    state.warning = obj.warning;
  },

  // 更改登录状态
  SET_LOGIN(state, boolean) {
    state.isLogin = boolean;
  },

  // 注册账号密码
  SET_ACCOUNT(state, obj) {
    state.account = obj.account;
    state.password = obj.password;
  },

  // 更改提醒登录状态
  SET_ATTENTION(state, obj) {
    state.ifAlert = obj.ifAlert;
    state.warning = obj.warning;
    state.noLogin = obj.noLogin;
    state.newSign = obj.newSign;
  },

  // 显示注册
  SHOW_LOGIN(state, boolean) {
    state.ifShow_login_alert = boolean;
  },

  // 显示登录
  SHOW_REGISTER(state, boolean) {
    state.ifShow_reg_alert = boolean;
    console.log('ifShow_reg_alert:', state.ifShow_reg_alert);
  },

}
