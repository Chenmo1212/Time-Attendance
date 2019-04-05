export default {
  // 更改登录状态
  setLogin({commit}, bool) {
    commit('SET_LOGIN',bool)
  },

  // 更改登录状态
  setAccount({commit}, obj) {
    commit('SET_ACCOUNT',obj)
  },

  // 显示登录
  showLogin({commit}, obj) {
    commit('SHOW_LOGIN',obj)
  },

  // 显示注册
  showRegister({commit}, obj) {
    commit('SET_ACCOUNT',obj)
  },

  // 给仓库赋值
  setClassLists({commit}, lists) {
    commit('change',lists)
  },

  // 显示Loading
  setLoading({commit}, msg) {
    commit('SET_LOADING',msg)
  },

  // 关闭loading
  closeLoading({commit}, bool) {
    commit('CLOSE_LOADING',bool)
  },

  // 设置提示
  setAttention({commit}, obj) {
    commit('SET_ATTENTION',obj)
  },

  // 遮挡二维码
  toShowBlock({commit}, bool) {
    commit('SHOW_BLOCK',bool)
  },

  // 遮挡二维码
  setWarn({commit}, msg) {
    commit('setWarning',msg)
  },

}
