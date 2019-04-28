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

  // 更改Warning
  SET_WARNING(state, warning) {
    state.isWarning = true;
    state.warning = warning;
  },
  CLOSE_WARNING(state, bool) {
    state.isWarning = bool;
  },

  // 更改Loading
  SET_LOADING(state, bool) {
    state.isLoading = bool;
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
    state.at_warning = obj.at_warning;
    state.noLogin = obj.noLogin;  // 提醒登录
    state.newSign = obj.newSign;  // 新建签到
    state.To_Data = obj.To_Data;  // 是在想去data的路上触发登录框
    state.EndSign = obj.EndSign;  // 结束考勤
  },

  // 显示登录
  SHOW_LOGIN(state, boolean) {
    state.ifShow_login_alert = boolean;
  },

  // 显示注册
  SHOW_REGISTER(state, boolean) {
    state.ifShow_reg_alert = boolean;
    console.log('ifShow_reg_alert:', state.ifShow_reg_alert);
  },

  // 遮挡二维码
  SHOW_BLOCK(state, boolean) {
    state.ShowBlock = boolean;
  },

  // 设置提示
  setAttention(msg,obj){
    this.$store.commit('SET_ATTENTION', {
      ifAlert: true,  // 提示窗口
      at_warning: msg, // 提示语
      EndSign: obj.EndSign,
      noLogin: obj.noLogin,
      To_Data: obj.To_Data,
    });
  },

  // 前往数据管理
  // TO_DATA(state, boolean){
  //   state.To_Data = obj.To_Data;  // 是在想去data的路上触发登录框
  // }

  // 当前考勤结束时考勤状态信息
  SET_ATTENDED(state, obj){
    state.attended = obj;
  }
}
