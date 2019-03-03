import Vue from 'vue'
import Router from 'vue-router'

// 引入组件
import home from '@/components/home'
// import attendance from '@/components/attendance'
import attendance from '@/components/attendance'
import notfound from '@/components/notfound'
import data_manager from '@/components/data_manager'
import login from '@/components/login'
import register from '@/components/register'
import introduction from '@/components/introduction'
import processbar from '@/components/processbar'

// 安装路由插件
Vue.use(Router);

export default new Router({
  routes: [

    // 重定向到home
    {
      path: '/',
      redirect: '/home'
    },

    // 主页
    {
      path: '/home',
      name: 'home',
      component: home
    },

    // 扫码页
    {
      path: '/attendance',
      name: 'attendance',
      component: attendance,
    },

    // 登录页
    {
      path: '/login',
      name: 'login',
      component: login,
    },

    // 注册页
    {
      path: '/register',
      name: 'register',
      component: register,
    },

    // 数据管理界面
    {
      path: '/data',
      name: 'data',
      component: data_manager,
    },

    // 使用说明界面
    {
      path: '/introduction',
      name: 'introduction',
      component: introduction,
    },

    // 进度条界面
    {
      path: '/processbar',
      name: 'processbar',
      component: processbar,
    },

    // 404页面
    {
      path: '*',
      name: 'notfound',
      component: notfound,
    }
  ]
})
