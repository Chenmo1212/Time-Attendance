<template>
  <div id="navVue">
    <!--导航菜单-->

    <div class="nav">
      <div class="w clearFix">
        <!--导航菜单 left begin-->
        <ul class="fl clearFix">
          <li id="logo" @click="toHome">快签到LOGO</li>
          <li :class="{ currentPage : this.$route.name === 'home' , home: true}" @click="toHome(true)">
            <i class="img-home"></i>
            <a href="#">新建签到</a>
          </li>
          <li :class="{ currentPage: this.$route.name === 'attendance' , attendance: true}" @click="toAttendance">
            <i class="img-attendance"></i>
            <a href="#">考勤界面</a>
          </li>
          <li :class="isLogin ? {currentPage: this.$route.name === 'data', data: true} : 'noLogin'" @click="toData">
            <i class="img-data"></i>
            <a href="#">数据管理</a>
          </li>
        </ul>
        <!--导航菜单 left end-->
        <!--导航菜单 right begin -->
        <ul class="fr">
          <li class="dd"><!--dropdown-->
            <div class="set">
              <i class="img-set"></i>
              <a href="#">设置</a>
              <i class="dd-icon"></i>
            </div>
            <div class="dd-m"><!--dropdown-menu-->
              <div class="dd-m1" @click="toIntro">
                <i class="img-intro"></i>
                <a href="#">使用说明</a>
              </div>
              <div class="dd-m2" @click="del">
                <i class="img-delData"></i>
                <a href="#">清除缓存</a>
              </div>
            </div>
          </li>
          <li class="spacer"></li>
          <li class="log login" v-if="!isLogin">
            <a href="#" @click="toLogin()">登录</a>
          </li>
          <li class="log logout" v-if="isLogin">
            <a href="#" @click="toLogout">注销</a>
          </li>
        </ul>
        <!--导航菜单 right begin-->
      </div>

    </div><!--nav-->

    <!--警告弹窗-->
    <transition name="alert">
      <div class="alert" v-show="ifAlert">
        <div class="alert-bg"></div>
        <div class="alert-wrap">
          <span class="alert-del" title="关闭" @click="alertDel"></span>
          <span class="alert-title">提示</span>
          <div class="alert-tip">{{ at_warning }}</div>

          <!--提醒登录-->
          <div class="alert-button" v-show="noLogin">
            <button class="alert-toLogin" @click="toData_Login">去登录</button>
            <button class="alert-cancel" @click="alertDel">取消</button>
          </div>

          <!--新建签到-->
          <div class="alert-button" v-show="newSign">
            <button class="alert-toLogin" @click="toHome(false)">确定</button>
            <button class="alert-cancel" @click="alertDel">取消</button>
          </div>

          <!--结束考勤-->
          <div class="alert-button" v-show="EndSign">
            <button class="alert-toLogin" @click="showBlock(true)">确定</button>
            <button class="alert-cancel" @click="alertDel">取消</button>
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

  export default {
    name: "navVue",
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
        'at_warning',
        'ifAlert',
        'ifShow_login_alert',
        'ifShow_reg_alert',
        'noLogin',
        'newSign',
        'EndSign',
        'to_data',
        'ShowBlock',
      ])
    },
    methods: {
      // 去“新建签到”
      toHome(bool) {
        console.log(bool);
        if (bool) {
          if (this.$route.name === 'attendance') {
            if (this.ShowBlock === false) {
              this.$store.commit('SET_ATTENTION', {
                ifAlert: true,  // 提示窗口
                at_warning: '当前正在考勤，确定要结束当前考勤重新开始签到？', // 提示语
                noLogin: false, // 未登录时的按钮
                newSign: true,  // 新建签到时的按钮
              });
              this.$store.commit('SHOW_BLOCK', false);
            } else {
              this.$store.commit('SET_ATTENTION', {
                ifAlert: true,  // 提示窗口
                at_warning: '此操作将清除本次数据，确定要重新开始签到？', // 提示语
                noLogin: false, // 未登录时的按钮
                newSign: true,  // 新建签到时的按钮
              });
              // this.$router.push({name: 'home'});
            }
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
        console.log("当前登录状态为：", this.isLogin);
        if (this.isLogin === true) {
          console.log("已经登录");
          console.log("仓库中是否有数据：");
          if (this.Class_lists.length === 0) {

            console.log("仓库中没有数据");
            console.log("弹出警告框");
            this.$store.commit('SET_LOADING', {isLoading: true, warning: '请填全信息开始签到'});
            setTimeout(() => {
              this.$store.commit('SET_LOADING', false);
            }, 1000);
            console.log("返回主页");
            this.$router.push({name: 'home'})
          } else {
            console.log("仓库中有数据");
            console.log("前往数据管理");
            this.$router.push({name: 'data'});
          }
        } else {
          console.log("尚未登录");
          console.log("弹出提示框，提醒登录");
          this.$store.commit('SET_ATTENTION', {
            ifAlert: true,
            at_warning: '该功能需要登陆后才可使用，请先登录。',
            noLogin: true,
            newSign: false,
            to_data: true,
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
        this.$store.commit('SET_ATTENTION', false);
        this.$store.commit('SHOW_LOGIN', true);
        console.log('弹出登录窗口', this.ifShow_login_alert);
      },

      // 去登录
      toData_Login() {
        console.log("点击“去登录”");
        this.$store.commit('SET_ATTENTION', {ifAlert: false, To_Data: true});
        // this.$store.commit('TO_DATA', true);
        this.$store.commit('SHOW_LOGIN', true);
        console.log('弹出登录窗口', this.ifShow_login_alert);
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

      showBlock() {
        this.$store.commit('SHOW_BLOCK', true);
        this.$store.commit('SET_ATTENTION', false);
      }
    }
  }
</script>

<style scoped>
  @import "../css/base.css";


  .nav {
    height: 60px;
    line-height: 60px;
    background-color: #fff;
    border-top: #1aad19 solid 2px;
    box-shadow: 0 2px 4px 0 rgba(238, 238, 238, 0.5);
    font-size: 16px;
  }

  .fl {
    float: left;
  }


  .nav .fl li {
    position: relative;
    float: left;
    margin-left: 80px;
    height: 60px;
    overflow: hidden;
    cursor: pointer;
  }

  .fr {
    float: right;
  }

  .nav .fr li {
    position: relative;
    float: left;
    cursor: pointer;
  }

  i {
    position: absolute;
    width: 16px;
    height: 16px;
    top: 50%;
    margin-top: -8px;
    display: inline-block;
  }

  .fl li a {
    display: block;
    margin-left: 20px;
    /*cursor: pointer;*/
  }

  /* 导航菜单 left begin */
  .img-home {
    background: url(../png/home.png);
    -webkit-background-size: 100%;
    background-size: 100%;
  }

  .img-attendance {
    background: url(../png/attendance.png);
    -webkit-background-size: 100%;
    background-size: 100%;
  }

  .img-data {
    background: url(../png/data.png);
    -webkit-background-size: 100%;
    background-size: 100%;
  }

  /*子菜单当前页面样式*/
  .fl .currentPage {
    border-bottom: #1aad19 solid 2px;
    background-color: #edeef0;
    padding: 0 10px;
  }

  .fl .currentPage a {
    color: #1aad19;
  }

  /*LOGO样式*/
  .fl #logo {
    margin-left: 0;
    font-weight: bold;
  }

  /*===============================新建签到=========================*/
  /*子菜单当前页面————新建签到*/
  .fl .currentPage .img-home {
    background-image: url(../png/home_check.png);
  }

  /*子菜单————新建签到*/
  .fl div .img-home {
    background-image: url(../png/home.png);
  }

  /*子菜单————新建签到鼠标悬浮*/
  .home:hover .img-home {
    background-image: url(../png/home_check.png);
  }

  .home:hover a {
    color: #1aad19;
  }

  /*===============================考勤界面=========================*/

  /*子菜单当前页面————考勤界面*/
  .fl .currentPage .img-attendance {
    background-image: url(../png/attendance_check.png);
  }

  /*子菜单————考勤界面*/
  .fl div .img-attendance {
    background-image: url(../png/attendance.png);
  }

  /*子菜单————考勤界面鼠标悬浮*/
  .attendance:hover .img-attendance {
    background-image: url(../png/attendance_check.png);
  }

  .attendance:hover a {
    color: #1aad19;
  }

  /*===============================数据管理=========================*/
  /*导航菜单————数据管理未登录时样式*/
  .fl .noLogin a {
    color: #9C8A8A;
  }

  .fl .noLogin .img-data {
    background-image: url(../png/data-nologin.png);
  }

  /*子菜单当前页面————数据管理*/
  .fl .currentPage .img-data {
    background-image: url(../png/data_check.png);
  }

  /*子菜单————数据管理鼠标悬浮*/
  .data:hover .img-data {
    background-image: url(../png/data_check.png);
  }

  .data:hover a {
    color: #1aad19;
  }

  /*子菜单————数据管理*/
  .nav div .img-data {
    background-image: url(../png/data.png);
  }

  /* 导航菜单 left end */


  /* 导航菜单 right begin */
  .fr i {
    position: absolute;
    display: inline-block;
    width: 16px;
    height: 16px;
    top: 50%;
    margin-top: -8px;
  }

  .fr a {
    display: block;
  }

  .spacer {
    width: 1px;
    height: 30px;
    background-color: #ccc;
    margin: 15px 15px 0;
  }

  .set {
    padding: 0 20px;
  }

  .img-intro {
    background: url(../png/introduction.png);
    -webkit-background-size: 100%;
    background-size: 100%;
    left: 0;
  }

  .img-delData {
    background: url(../png/delData.png);
    -webkit-background-size: 100%;
    background-size: 100%;
    left: 0;
  }

  .dd-icon {
    background: url(../png/dropdown-icon.svg);
    -webkit-background-size: 100%;
    background-size: 100%;
    right: 0;
  }

  .dd:hover .dd-m {
    display: block;
  }

  .dd-m {
    display: none;
    position: absolute;
    margin-top: -10px;
    left: -20px;
    width: 120px;
    -webkit-box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  }

  .dd-m div {
    position: relative;
    height: 40px;
    line-height: 40px;
    background-color: #fff;
    text-align: center;
    border-top: 1px solid #e7e7eb;
  }

  .dd-m div:hover {
    background-color: #edeef0;
  }

  .img-set {
    background: url(../png/set.svg);
    -webkit-background-size: 100%;
    background-size: 100%;
    left: 0;
  }

  .img-set {
    background: url(../png/set.svg);
    -webkit-background-size: 100%;
    background-size: 100%;
    left: 0;
  }

  .dd-m i {
    position: absolute;
    margin-left: 10px;
  }

  .dd-m a {
    margin-left: 10px;
    font-size: 14px;
  }

  .fr log a:active {
    color: #1aad19;
  }

  /* 导航菜单 right end */


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
    border: 1px solid #e7e7eb;
    height: 30px;
    width: 90px;
    margin-left: 20px;
    margin-right: 20px;
    border-radius: 5px;
    background-color: #fff;
    color: #9b9b9e;
    outline: none;
    cursor: pointer;
  }

  .alert-button .alert-cancel:hover {
    background-color: #e7e7eb;
  }

  .alert-button .alert-toLogin {
    background-color: #44b549;
    color: #fff;
  }

  .alert-button .alert-toLogin:hover {
    background-color: #2f9833;
    color: #fff;
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
