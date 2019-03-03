// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import totp from 'otplib/totp';





//引入vuex中的store
import store from './store/store'

// 引入全局组件
// import footerVue from './components/footer'
import navVue from './components/navVue'
import login from '@/components/login'
import register from '@/components/register'

// 声明全局组件
Vue.component('navVue', navVue);
Vue.component('loginVue', login);
Vue.component('registerVue', register);
// Vue.component('footerVue', footerVue);

Vue.config.productionTip = false

Vue.prototype.globalClick = function (callback) {
  document.getElementById('app').onclick = callback;
};

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
