<template>
  <div id="app">
    <nav-vue style="height: 8%;"></nav-vue>
    <!--<router-view/>-->
    <router-view></router-view>
    <transition name="login">
      <login-vue v-show="ifShow_login_alert"></login-vue>
    </transition>
    <transition name="register">
      <register-vue v-show="ifShow_reg_alert"></register-vue>
    </transition>

    <!--提示弹窗-->
    <transition name="warning">
      <div class="onLoad" v-if="isWarning === true"><span>{{ warning }}</span></div>
    </transition>

    <!--loading-->
    <div id="loading" v-if="isLoading">
      <div class="loading_bd">
        <div class="sk-chasing-dots">
          <div class="sk-child sk-dot1"></div>
          <div class="sk-child sk-dot2"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState,mapActions} from 'vuex';

  export default {
    name: 'App',
    data() {
      return {}
    },
    computed: {
      ...mapState([
        'ifShow_reg_alert',
        'ifShow_login_alert',
        'isWarning',
        'warning',
        'isLoading',
      ])
    },
    methods: {
      ...mapActions([
        "closeWarning",
        "setLoading",
      ]),
      // 设置警告
      setWarning() {
        if (this.isWarning) {
          clearTimeout(timeId);
          var timeId = setTimeout(() => {
            this.closeWarning(false);
          }, 1000);
        }
      },
      // 设置加载
      setLoad(){
        var that = this;
        if (this.isLoading) {
          clearTimeout(timeId);
          var timeId = setTimeout(() => {
            that.setLoading(false);
            console.log("123")
          }, 2000);
        }
      }
    },
    watch: {
      isWarning: function () {
        this.setWarning();
      },
      isLoading: function () {
        this.setLoad();
      }
    }
  }
</script>

<style>
  @import "./css/normalize.css";
  @import "./css/base.css";

  #app {
    font-family: -apple-system-font, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif;
    /*-webkit-font-smoothing: antialiased;*/
    /*-moz-osx-font-smoothing: grayscale;*/
    /*text-align: center;*/
    /*color: #2c3e50;*/
    /*margin-top: 60px;*/
    background: #f6f8f9;
  }

  .login-enter-active,
  .register-enter-active {
    transition: all 0.3s ease;
  }

  .login-enter,
  .register-enter {
    /* .slide-fade-leave-active for below version 2.1.8 */
    /*transform: translateY(7px);*/
    opacity: 0;
  }

  .login-leave-active,
  .register-leave-active {
    transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .login-leave-to,
  .register-leave-to {
    opacity: 0;
  }

  /*====================    warning-begin     ================*/
  .onLoad {
    position: absolute;
    height: 100px;
    line-height: 100px;
    text-align: center;
    width: auto;
    min-width: 160px;
    background-color: rgba(66, 66, 66, .9);
    border-radius: 3%;
    color: #FFF;
    top: 240px;
    left: 50%;
    margin-left: -80px;
    z-index: 101;
  }

  .onLoad > span {
    padding: 0 1em;
  }

  .warning-enter-active {
    transition: all 0.3s ease;
  }

  .warning-enter {
    /* .slide-fade-leave-active for below version 2.1.8 */
    transform: translateY(7px);
    opacity: 0;
  }

  .warning-leave-active {
    transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .warning-leave-to {
    opacity: 0;
  }

  /*====================    warning-end     ================*/

  /*====================    loading begin     ===============*/

  #loading {
    width: 100%;
    height: 92%;
    top: 8%;
    position: absolute;
    background-color: #F6F8F9;
    z-index: 101;
  }

  .sk-chasing-dots {
    margin: 40px auto;
    width: 40px;
    height: 40px;
    position: relative;
    text-align: center;
    -webkit-animation: sk-chasingDotsRotate 2s infinite linear;
    animation: sk-chasingDotsRotate 2s infinite linear;
  }

  .sk-chasing-dots .sk-child {
    width: 60%;
    height: 60%;
    display: inline-block;
    position: absolute;
    top: 0;
    background-color: #1AAD19;
    border-radius: 100%;
    -webkit-animation: sk-chasingDotsBounce 2s infinite ease-in-out;
    animation: sk-chasingDotsBounce 2s infinite ease-in-out;
  }

  .sk-chasing-dots .sk-dot2 {
    top: auto;
    bottom: 0;
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
  }

  @-webkit-keyframes sk-chasingDotsRotate {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  @keyframes sk-chasingDotsRotate {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  @-webkit-keyframes sk-chasingDotsBounce {

    0%,
    100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }

    50% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }

  @keyframes sk-chasingDotsBounce {

    0%,
    100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }

    50% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }

  /*====================    loading end     ===============*/
</style>
