<template>
  <div id="navVue">
    <!--导航菜单-->

    <div class="nav">
      <div class="w clearFix">
        <!--导航菜单 left begin-->
        <ul class="fl clearFix">
          <li id="logo" @click="toHome">
            <img src="../png/LOGO2.png" alt="">
            <span>快签到考勤</span>
          </li>
          <li :class="{ currentPage : this.$route.name === 'home'}" @click="toHome(true)">
            <i class="iconfont img img-home">&#xe639;</i>
            新建签到
          </li>
          <li :class="{ currentPage: this.$route.name === 'attendance'}" @click="toAttendance">
            <i class="iconfont img img-attendance">&#xe605;</i>
            考勤界面
          </li>
          <li :class="isLogin ? {currentPage: this.$route.name === 'data', img_data: true} : 'noLogin'" @click="toData">
            <i class="iconfont img img-data">&#xe61b;</i>
            数据管理
          </li>
        </ul>
        <!--导航菜单 left end-->
        <!--导航菜单 right begin -->
        <ul class="fr">
          <li class="dd"><!--dropdown-->
            <div class="set">
              <i class="iconfont img">&#xe604;</i>
              设置
              <i class="dd-icon"></i>
            </div>
            <div class="dd-m"><!--dropdown-menu-->
              <div class="dd-m1" @click="toIntro">
                <i class="iconfont img">&#xe66a;</i>
                使用说明
              </div>
              <div class="dd-m2" @click="del">
                <i class="iconfont img">&#xe600;</i>
                清除缓存
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
          <i class="alert-del iconfont" title="关闭" @click="alertDel">&#xe620;</i>
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

          <!--F11-->
          <div class="alert-button" v-show="full_screen">
            <button class="alert-toLogin" @click="fullScreen">确定</button>
            <button class="alert-cancel" @click="alertDel">取消</button>
          </div>
        </div>
      </div>
    </transition>



    <transition name="introduction">
      <div class="intro" v-show="showIntro">
        <div class="intro-bg"></div>
        <div class="intro-wrap">
          <i class="intro-del iconfont" title="关闭" @click="alertDel">&#xe620;</i>
          <span class="intro-title">使用说明</span>
          <div class="content">
            <p>
              快签到智能考勤是一款专注于课堂考勤的产品，旨在实现高效考勤，拒绝学生替考勤、替课等行为，帮助老师实现考勤数据管理，提高老师的工作效率。<br>
              为了更好地帮助新手使用该产品，小编特意写了一份新手指南向新手们介绍本产品是使用方法。
            </p>
            <br>
            <p class="text1">如果仅为临时使用，不保存考勤数据，无需注册登录；<br>
              如果需要进行考勤数据管理，请先注册登录。<br>
              注：数据管理可以记录每一位学生的考勤情况。<br>

              未登录状态考勤
            </p>
            <br>
            <p>
              请按照文字提示填写考勤班级与考勤学生的学号，如果多个班级进行考勤，请点击加号添加考勤班级，之后点击“开始签到”跳转到“考勤界面”开始考勤。
            </p><br>
            <img src="../png/intro/1.png" alt="">
            <br>
            <br>
            <p>右击右侧的按钮，可以更改学生的考勤状态。红色代表未到学生，绿色代表已到学生。<br>
              （注：如果右击后菜单出现错位，请将尺寸设置到正确比例，缩放等不正当操作将会做成错位）<br>
              <br>
              点击“结束考勤”按钮，可结束当前考勤。
            </p><br>
            <img src="../png/intro/2.png" alt="">
            <br><br>
            <p class="text1">
              登录状态考勤 <br>
              方式一：先登录再考勤 <br>
            </p>
            <p>未注册用户需注册后再使用，点击“登录”，在弹出的窗口中点击“点击注册”</p><br>
            <img src="../png/intro/3.png" alt="">
            <img src="../png/intro/4.png" alt="">
            <br><br>
            <p>点击“登录”按钮进行登录，登录后可以保存考勤数据</p><br>
            <img src="../png/intro/5.png" alt="">
            <br><br>
            <p>考勤操作同未登录状态的操作相同。 <br>
              <br>
              点击“数据考勤”可以查看考勤结果，点击“详情”可以查看缺勤同学的具体情况，为老师算平时分数提供准确依据。
            </p><br>
            <img src="../png/intro/6.png" alt="">
            <img src="../png/intro/7.png" alt="">
            <br>
            <br>
            <p class="text1">方式二：先考勤再登录</p> <br>
            <p>考勤操作同未登录状态时的操作相同，未登录时“数据管理”呈灰色状态。若需要保留考勤数据，请先点击“登录”。</p><br>
            <img src="../png/intro/8.png" alt="">
            <br><br>
            <p>登录后“数据管理”成黑色状态，点击后跳转至该页面，单击“详情”即可查看缺勤学生的详细信息。</p>
            <br>
            <img src="../png/intro/9.png" alt="">
            <img src="../png/intro/10.png" alt="">
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
  import {mapState,mapActions} from 'vuex'
  // import {} from "../axios/api";


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
        'full_screen',
        'to_data',
        'ShowBlock',
        'full',
      ])
    },
    methods: {
      ...mapActions([
        'setWarn',
      ]),
      fullScreen() {
        this.alertDel();
        this.$store.commit('SET_FULL', true);
        var el = document.getElementById('app');
        var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen,
          wscript;

        if (typeof rfs != "undefined" && rfs) {
          rfs.call(el);
          return;
        }

        if (typeof window.ActiveXObject != "undefined") {
          wscript = new ActiveXObject("WScript.Shell");
          if (wscript) {
            wscript.SendKeys("{F11}");
          }
        }

      },

      // 去“新建签到”
      toHome(bool) {
        console.log(bool);
        if (bool) {
          if (this.$route.name === 'attendance') {
            if (this.ShowBlock === false) {
              // 表示在未结束签到的情况下点击“新建签到”
              this.$store.commit('SET_ATTENTION', {
                ifAlert: true,  // 提示窗口
                at_warning: '当前正在考勤，确定要结束当前考勤重新开始签到？', // 提示语
                noLogin: false, // 未登录时的按钮
                newSign: true,  // 新建签到时的按钮
              });
            } else {
              // 表示在已结束签到的情况下点击“新建签到”
              this.$store.commit('SET_ATTENTION', {
                ifAlert: true,  // 提示窗口
                at_warning: '此操作将清除本次数据，确定要重新开始签到？', // 提示语
                noLogin: false, // 未登录时的按钮
                newSign: true,  // 新建签到时的按钮
              });
            }
          } else {
            this.$router.push({name: 'home'});
          }
        } else {
          this.$store.commit('SET_ATTENTION', false);
          this.$store.commit('change', '');
          this.$store.commit('SHOW_BLOCK', false);
          this.$router.push({name: 'home'});
        }

      },

      // 去”考勤界面“
      toAttendance() {
        console.log(this.Class_lists.length);
        if (this.Class_lists.length === 0) {
          // this.$store.commit('SET_LOADING', '请点击"开始签到"');
          this.setWarn('请点击"开始签到"');
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
          // 仓库中是否有数据
          if (this.Class_lists.length === 0) {
            // 仓库中没有数据
            this.setWarn('请填全信息开始签到');
            // 返回主页
            this.$router.push({name: 'home'})
          } else {
            // 仓库中有数据
            // 是否已经结束考勤
            if(this.ShowBlock){
              // 前往数据管理
              this.$router.push({name: 'data'});
            } else {
              // 未结束考勤
              this.setWarn("请结束考勤后重试");
            }
          }
        } else {
          // 尚未登录
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
        //   console.log("123");
        // }, 1000);
        this.$router.push({name: 'introduction'});
        // this.showIntro = true;
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
        this.$store.commit('SET_LOADING',  '数据已删,请刷新');
        this.$router.push({name: 'home'});
        // 清除缓存
        window.onbeforeunload = function (e) {
          var storage = window.localStorage;
          storage.clear();
        };
        // 自动刷新
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
        this.$store.commit('SET_LOADING',  '注销成功');
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

  .nav li {
    position: relative;
    float: left;
    cursor: pointer;
  }

  .nav .fl li {
    margin-left: 80px;
    height: 60px;
  }

  .fr {
    float: right;
  }

  i {
    display: inline-block;
    vertical-align: top;
  }

  /*子菜单当前页面样式*/
  .currentPage {
    border-bottom: #1aad19 solid 2px;
    background-color: #edeef0;
    padding: 0 10px;
    color: #1aad19;
  }

  .fl li:nth-child(2):hover {
    color: #1aad19;
  }

  .fl li:nth-child(3):hover {
    color: #1aad19;
  }

  /*LOGO样式*/
  .fl #logo {
    margin-left: 0;
    width: 150px;
    font-size: 18px;
    /*font-weight: ;*/
  }

  .fl #logo img {
    width: 50px;
    height: 50px;
    margin-top: 5px;
  }

  .fl #logo a {
    margin-left: 60px;
    color: red;
  }

  #logo span {
    line-height: 60px;
    position: absolute;
    top: 0;
    right: 0;
  }

  /*===============================数据管理=========================*/

  .img_data:hover {
    color: #1aad19;
  }
  .fl .noLogin {
    color: #8d8a8a;
    cursor: not-allowed;
  }

  /* 导航菜单 left end */


  /* 导航菜单 right begin */


  .fr a {
    display: block;
    z-index: 999;
  }

  .spacer {
    width: 1px;
    height: 30px;
    background-color: #ccc;
    margin: 15px 15px 0;
  }

  /*动画开始*/
  .dd:hover .dd-m div {
    opacity: 1;
    transform: none;
  }

  .dd-m div:nth-child(1) {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    -webkit-transition-delay: 250ms;
  }

  .dd-m div:nth-child(2) {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    -webkit-transition-delay: 200ms;
  }

  .dd:hover .dd-m div:nth-child(1) {
    -webkit-transition-delay: 0s;
  }

  .dd:hover .dd-m div:nth-child(2) {
    -webkit-transition-delay: 50ms;
  }

  .dd-m {
    display: block;
    z-index: 999;
    position: absolute;
    margin-top: -10px;
    left: -20px;
    width: 120px;
    -webkit-box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    -webkit-perspective: 400px;
    max-height: 0;
  }

  .dd-m div {
    position: relative;
    height: 40px;
    line-height: 40px;
    background-color: #fff;
    text-align: center;
    opacity: 0;
    transform: rotateY(90deg);
    transition: opacity .4s, transform .5s;
  }

  /*动画结束*/

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

  .dd-m {
    font-size: 14px;
  }

  .dd-m1 i {
    font-size: 20px;
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
    float: right;
    padding: 4px;
    font-size: 30px;
    color: #8d8a8a;
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
    float: right;
    font-size: 30px;
  }

  .intro-title {
    cursor: pointer;
    /*width: 60px;*/
    height: 40px;
    display: block;
    margin: 50px auto 20px;
    z-index: 101;
    font-size: 26px;
    text-align: center;
  }

  .content {
    font-size: 16px;
    margin: 0 100px;
    height: 500px;
    overflow: hidden;
    overflow-y: auto;
  }

  .content img {
    width: 1000px;
  }

  .content .text1 {
    font-weight: 700;
  }

  .intro-bottom-wrap span {
    padding: 0;
    margin: 0;
    color: #444;
    vertical-align: top;
    outline: none;
  }

  /*====================    intro-end    ================*/




  .alert-enter-active,
  .introduction-enter-activee {
    transition: all 0.3s ease;
  }

  .alert-enter,
  .introduction-enter{
    /* .slide-fade-leave-active for below version 2.1.8 */
    transform: translateY(7px);
    opacity: 0;
  }

  .introduction-leave-active {
    transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .introduction-leave-to {
    opacity: 0;
  }


</style>
