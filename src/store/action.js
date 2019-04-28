export default {
  // 更改登录状态
  setLogin({commit}, bool) {
    commit('SET_LOGIN', bool)
  },

  // 更改登录状态
  setAccount({commit}, obj) {
    commit('SET_ACCOUNT', obj)
  },

  // 显示登录
  showLogin({commit}, obj) {
    commit('SHOW_LOGIN', obj)
  },

  // 显示注册
  showRegister({commit}, obj) {
    commit('SET_ACCOUNT', obj)
  },

  // 给仓库赋值
  setClassLists({commit}, lists) {
    commit('change', lists)
  },


  // 关闭loading
  closeWarning({commit}, bool) {
    commit('CLOSE_WARNING', bool)
  },

  // 设置提示
  setAttention({commit}, obj) {
    commit('SET_ATTENTION', obj)
  },

  // 遮挡二维码
  toShowBlock({commit}, bool) {
    commit('SHOW_BLOCK', bool)
  },

  // 设置警告
  setWarn({commit}, msg) {
    commit('SET_WARNING', msg)
  },


  // 显示Loading
  setLoading({commit}, bool) {
    commit('SET_LOADING', bool)
  },

  // 设置警告
  setAttended({commit}, obj) {
    commit('SET_ATTENDED', obj)
  },
}
