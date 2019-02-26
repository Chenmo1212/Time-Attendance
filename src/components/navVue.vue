<template>
  <div id="header">
    <!--导航菜单-->
    <div class="nav">

      <div id="logo" @click="toHome">
        <span>智能考勤系统</span>
      </div>
      <div :class="{ currentPage: this.$route.name === 'home' , home: true}" @click="toHome(true)">
        <div class="img"></div>
        <span>新建签到</span>
      </div>
      <div :class="{ currentPage: this.$route.name === 'attendance' , attendance: true}" @click="toAttendance">
        <div class="img"></div>
        <span>考勤界面</span>
      </div>
      <div :class="isLogin ? {currentPage: this.$route.name === 'data', data: true} : 'noLogin'" @click="toData">
        <div class="img"></div>
        <span>数据管理</span>
      </div>

      <!--管理员-->
      <div class="manager">
        <div class="dropdown">
          <span class="img"></span>
          <span class="text">设置</span>
        </div>
        <div class="dropdown-content">
          <span @click="toIntro" style="border: none;">使用说明</span>
          <!--<span v-if="isLogin" @click="toMang">账号详情</span>-->
          <span @click="del" class="del" title="删除本地数据">清除缓存</span>
          <span v-if="isLogin" @click="toLogout">退出登录</span>
        </div>
      </div>

      <!--登录-->
      <div class="login" v-if="!isLogin">
        <button class="login_button" @click="toLogin()">登录</button>
      </div>
      <!--注销-->
      <div class="logout" v-if="isLogin">
        <button class="logout-button" @click="toLogout">注销</button>
      </div>

    </div><!--nav-->

    <!--警告弹窗-->
    <transition name="alert">
      <div class="alert" v-show="ifAlert">
        <div class="alert-bg"></div>
        <div class="alert-wrap">
          <span class="alert-del" title="关闭" @click="alertDel"></span>
          <span class="alert-title">警告</span>
          <div class="alert-tip">{{ warning }}</div>
          <div class="alert-button" v-show="noLogin">
            <button class="alert-cancel" @click="alertDel">取消</button>
            <button class="alert-toLogin" @click="toLogin">去登录</button>
          </div>
          <div class="alert-button" v-show="newSign">
            <button class="alert-cancel" @click="alertDel">取消</button>
            <button class="alert-toLogin" @click="toHome(false)">确定</button>
          </div>

        </div>
      </div>
    </transition>

    <!--提示弹窗-->
    <transition name="warning">
      <div class="onLoad" v-if="isLoading === true"><span>{{ warning }}</span></div>
    </transition>

    <transition name="introduction">
      <div class="intro" v-show="showIntro">
        <div class="intro-bg"></div>
        <div class="intro-wrap">
          <span class="intro-del" title="关闭" @click="alertDel"></span>
          <span class="intro-title">使用说明</span>
          <!--<div class="alert-tip">-->
          <!--&lt;!&ndash;该功能需要登陆后才可使用 <br> 请先登录&ndash;&gt;-->
          <!--该功能需要登陆后才可使用，请先登录。-->
          <!--</div>-->
          <!--<button class="alert-toLogin" @click="toLogin">去登录</button>-->
          <div class="intro-bottom">
            <div class="intro-bottom-wrap">
              <input type="checkbox" class="checkbox" @click="checkbox">
              <span>我知道了</span>
            </div>
          </div>

        </div>
      </div>
    </transition>

  </div>
</template>

<script>
  import {mapState} from 'vuex'
  // import {} from "../axios/api";


  export default {
    name: "header",
    data() {
      return {
        // 当前界面——导航菜单栏选中样式
        currentPage: false,

        showIntro: false,
      }
    },
    computed: {
      ...mapState([
        'Class_lists',
        'isLoading',
        'isLogin',
        'warning',
        'ifAlert',
        'ifShow_login_alert',
        'ifShow_reg_alert',
        'noLogin',
        'newSign',
      ])
    },
    methods: {
      // 去“新建签到”
      toHome(bool) {
        if (bool) {
          if (this.$route.name === 'attendance') {
            this.$store.commit('SET_ATTENTION', {
              ifAlert: true,
              warning: '当前正在考勤，确定要结束当前考勤重新开始签到？',
              noLogin: false,
              newSign: true
            });
          } else {
            this.$router.push({name: 'home'});
          }
        } else {
          this.$store.commit('SET_ATTENTION', false);
          this.$store.commit('change', '');
          console.log(this.Class_lists);
          this.$router.push({name: 'home'});
        }

      },

      // 去”考勤界面“
      toAttendance() {
        console.log(this.Class_lists.length);
        if (this.Class_lists.length === 0) {

          this.$store.commit('SET_LOADING', {isLoading: true, warning: '请点击"开始签到"'});
          setTimeout(() => {
            this.$store.commit('SET_LOADING', false);
          }, 1000);

          this.$router.push({name: 'home'})
        } else {
          this.$router.push({name: 'attendance'});
        }
      },

      // 去“数据管理”
      toData() {
        if (this.isLogin === true) {
          if (this.Class_lists.length === 0) {

            this.$store.commit('SET_LOADING', {isLoading: true, warning: '请填全信息开始签到'});
            setTimeout(() => {
              this.$store.commit('SET_LOADING', false);
            }, 1000);

            this.$router.push({name: 'home'})
          } else {
            this.$router.push({name: 'data'});
          }
        } else {
          this.$store.commit('SET_ATTENTION', {
            ifAlert: true,
            warning: '该功能需要登陆后才可使用，请先登录。',
            noLogin: true,
            newSign: false
          });
        }
      },

      // 使用说明
      toIntro() {
        // this.$store.commit('SET_LOADING', {isLoading: true, warning: '程序猿很懒还没写'});
        // setTimeout(() => {
        //   this.$store.commit('SET_LOADING', false);
        // }, 1000);
        this.showIntro = true;
      },

      // 账号详情
      // toMang(){
      //   this.$store.commit('SET_LOADING', {isLoading: true, warning: '哈哈哈，也没写'});
      //   setTimeout(() => {
      //     this.$store.commit('SET_LOADING', false);
      //   }, 1000);
      // },

      // 清除数据
      del() {
        this.$store.commit('SET_LOADING', {isLoading: true, warning: '数据已删,请刷新'});
        setTimeout(() => {
          this.$store.commit('SET_LOADING', false);
        }, 1000);

        this.$router.push({name: 'home'});
        window.onbeforeunload = function (e) {
          var storage = window.localStorage;
          storage.clear();
        };
        window.location.reload();
      },

      // 关闭弹窗
      alertDel() {
        // 警告弹窗
        this.$store.commit('SET_ATTENTION', false);
        this.showIntro = false;
      },

      // 去登录
      toLogin() {
        console.log("去登录");
        // this.$store.commit('SET_ATTENTION', false);
        this.$store.commit('SHOW_LOGIN', true);
        // this.$store.commit('SHOW_REGISTER', true);
        // console.log('ifShow_reg_alert:', this.ifShow_reg_alert);
        console.log('ifShow_login_alert:', this.ifShow_login_alert);
        // this.$router.push({name:'login'});
      },

      // 去注册
      toReg() {
        this.$router.push({name: 'register'});
      },

      checkbox() {
        console.log("不再显示");
      },

      // 注销
      toLogout() {
        this.$store.commit('SET_LOADING', {isLoading: true, warning: '注销成功'});
        setTimeout(() => {
          this.$store.commit('SET_LOADING', false);
        }, 1000);
        if (this.$route.name !== 'home') {
          this.$router.push({name: 'home'});
        }
        this.$store.commit('SET_LOGIN', false);
      },

    }
  }
</script>

<style scoped>
  /*====================    nav-begin     ================*/
  .nav {
    height: 7vh;
    width: 100vw;
    background-color: #fff;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-top: #1aad19 solid 2px;
    box-shadow: 0 1px 4px 0 rgba(238, 238, 238, 0.5);
  }

  .nav #logo,
  .nav .home,
  .nav .attendance,
  .nav .data {
    height: 6.5vh;
    /*background-color: #aaa;*/
    line-height: 6.5vh;
    text-align: center;
    /*min-width: 100px;*/
    /*max-width: 120px;*/
    width: 6.25vw;
    margin-left: 50px;
    /*font-weight: bold;*/
    /*font-size: 14px;*/
    cursor: pointer;
  }

  .nav #logo {
    margin-left: 6.771vw;
    margin-right: 2.604vw;
    font-weight: bold;
  }

  .nav button {
    /*width: 100px;*/
    border: none;
    background: none;
    font-size: 16px;
  }

  .nav .home:hover,
  .nav .attendance:hover,
  .nav .data:hover,
  .nav .currentPage {
    border-bottom: #1aad19 solid 2px;
    color: #1aad19;
    background-color: #edeef0;
  }


  /*manager-begin*/
  .nav .manager {
    position: absolute;
    right: 4vw;
    height: 48px;
    width: 6.25vw;
    text-align: center;
    /*font-size: 14px;*/
  }

  .manager:hover .dropdown-content {
    display: block;
  }


  .manager .dropdown span {
    display: inline-block;
    vertical-align: top;
  }

  .manager .dropdown .img {
    margin-top: 11px;
    height: 26px;
    width: 26px;
    background-image: url(../png/set.svg);
    -webkit-background-size: 100%;
    background-size: 100%;
  }

  .manager .dropdown .text {
    margin-top: 9px;
    height: 30px;
    line-height: 30px;
    margin-left: 5px;
    padding-right: 15px;
    border-right: #e7e7eb solid 1px;
  }

  .manager .dropdown-content {
    position: relative;
    display: none;
    font-size: 14px;
  }

  .manager .dropdown-content span {
    display: block;
    width: 120px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background-color: #fff;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.2);
    border-top: 1px solid #e7e7eb;
  }

  .manager .dropdown-content span:hover {
    background-color: #edeef0;
  }

  .login,
  .logout {
    position: absolute;
    right: 10px;
    max-width: 50px;
    max-height: 60px;
    vertical-align: top;
    /*background-color: #aaa;*/
  }

  .login:active .login_button,
  .logout:active .logout-button {
    color: #1aad19;
  }

  .login_button,
  .logout-button {
    height: 48px;
    width: 3vw;
    outline: none;
  }

  .logout-button:focus {
    outline: none;
  }

  .noLogin {
    color: #8d8a8a;
    height: 6.5vh;
    line-height: 6.5vh;
    text-align: center;
    width: 100px;
    margin-left: 50px;
    cursor: pointer;
  }

  /*====================    nav-end     ================*/


  /*====================    alert-begin     ================*/
  .alert {
    /*display: none;*/
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 99;
  }

  .alert-del {
    cursor: pointer;
    width: 40px;
    height: 40px;
    background: url(../png/tiny-delete.png) no-repeat center center;
    display: block;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 9999;
  }

  .alert button {
    border: none;
    /*background: none;*/
  }

  .alert-bg {
    width: 100%;
    height: 100%;
    background: #000;
    filter: alpha(opacity=50);
    opacity: .5;
  }

  .alert-wrap {
    position: absolute;
    max-width: 420px;
    height: 200px;
    left: 50%;
    top: 25%;
    margin-left: -210px;
    background: #fff;
    border-radius: 10px;
    -webkit-animation: alert .3s;
    animation: alert .3s;
    width: 100%;
  }

  .alert-title {
    cursor: pointer;
    width: 60px;
    height: 40px;
    display: block;
    position: absolute;
    left: 50%;
    margin-left: -30px;
    top: 20px;
    z-index: 101;
    font-size: 18px;
    text-align: center;
  }

  .alert-tip {
    text-align: center;
    color: #7a7a7a;
    font-size: 14px;
    width: 100%;
    height: 20px;
    margin-top: 80px;
  }

  .alert-button {
    position: absolute;
    bottom: 20px;
    display: block;
    width: 420px;
    height: 30px;
    text-align: center;
    /*background-color: ;*/
  }

  .alert-button button {
    height: 30px;
    width: 100px;
    margin-left: 20px;
    margin-right: 20px;
    border-radius: 5px;
    background-color: #a7a7a7;
    color: white;
    outline: none;
    cursor: pointer;
  }

  .alert-button .alert-toLogin {
    background-color: #1aad19;
  }

  /*====================    alert-end     ================*/


  /*====================    intro-begin    ================*/
  .intro {
    /*display: none;*/
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 99;
  }

  .intro-bg {
    width: 100%;
    height: 100%;
    background: #000;
    filter: alpha(opacity=50);
    opacity: .5;
  }

  .intro-wrap {
    position: absolute;
    padding: 0.5em;
    max-width: 90%;
    height: 90%;
    left: 50%;
    top: 5%;
    margin-left: -45%;
    background: #fff;
    border-radius: 2px;
    -webkit-animation: alert .3s;
    animation: alert .3s;
    width: 100%;
  }

  .intro-del {
    cursor: pointer;
    width: 40px;
    height: 40px;
    background: url(../png/tiny-delete.png) no-repeat center center;
    display: block;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 9999;
  }

  .intro-title {
    cursor: pointer;
    /*width: 60px;*/
    height: 40px;
    display: block;
    margin: 50px auto;
    z-index: 101;
    font-size: 26px;
    text-align: center;
  }

  .intro-bottom {
    display: block;
    text-align: center;
    width: 100%;
    margin-top: 10px;
    padding-bottom: 30px;
    font-size: 12px;
    position: absolute;
    bottom: 30px;
  }

  .intro-bottom-wrap {
    width: 272px;
    display: inline-block;
    position: absolute;
    left: 50%;
    margin-left: -150px;
  }

  .intro-bottom-wrap .checkbox {
    padding: 0;
    /*margin: 0;*/
    /*height: 20px;*/
    /*width: 20px;*/
    margin-top: 3px;
    background-color: #aaa;
    cursor: pointer;
    vertical-align: top;
    outline: none;

  }

  .intro-bottom-wrap span {
    padding: 0;
    margin: 0;
    color: #444;
    vertical-align: top;
    outline: none;
  }

  /*====================    intro-end    ================*/


  /*====================    warning-begin     ================*/
  .onLoad {
    position: absolute;
    height: 100px;
    line-height: 100px;
    text-align: center;
    width: 160px;
    background-color: rgba(66, 66, 66, .9);
    border-radius: 3%;
    color: #FFF;
    top: 240px;
    left: 50%;
    margin-left: -80px;
    z-index: 101;
  }

  /*====================    warning-end     ================*/

  .alert-enter-active,
  .introduction-enter-active,
  .warning-enter-active {
    transition: all 0.3s ease;
  }

  .alert-enter,
  .introduction-enter,
  .warning-enter {
    /* .slide-fade-leave-active for below version 2.1.8 */
    transform: translateY(7px);
    opacity: 0;
  }

  .warning-leave-active,
  .introduction-leave-active {
    transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .warning-leave-to,
  .introduction-leave-to {
    opacity: 0;
  }


</style>
