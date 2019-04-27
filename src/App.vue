<template>
  <div id="app">
    <nav-vue></nav-vue>
    <!--<router-view/>-->
    <router-view></router-view>
    <transition name="login">
      <login-vue v-show="ifShow_login_alert" ></login-vue>
    </transition>
    <transition name="register" >
      <register-vue v-show="ifShow_reg_alert" ></register-vue>
    </transition>

    <!--提示弹窗-->
    <transition name="warning">
      <div class="onLoad" v-if="isLoading === true"><span>{{ warning }}</span></div>
    </transition>
    <!--<footer-vue></footer-vue>-->
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  export default {
    name: 'App',
    data(){
      return {}
    },
    computed: {
      ...mapState([
        'ifShow_reg_alert',
        'ifShow_login_alert',
        'isLoading',
        'warning',
      ])
    },
    methods: {
      // 设置警告
      setWarning() {
        if(this.isLoading) {
          // this.$store.commit('SET_LOADING', this.warning);
          setTimeout(() => {
            this.$store.commit('CLOSE_LOADING', false);
          }, 1000);
        }
      },
    },
    watch: {
      isLoading: function (){
      this.setWarning();
  }
    }
  }
</script>

<style>
  @import "./css/normalize.css";
  @import "./css/base.css";
#app {
  font-family: -apple-system-font,BlinkMacSystemFont,"Helvetica Neue","PingFang SC","Hiragino Sans GB","Microsoft YaHei UI","Microsoft YaHei",Arial,sans-serif;
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
</style>
