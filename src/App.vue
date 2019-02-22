<template>
  <div id="app">
    <nav-vue></nav-vue>

    <router-view/>

    <transition name="login">
      <login-vue v-show="ifShow_login_alert" ></login-vue>
    </transition>
    <transition name="register" >
      <register-vue v-show="ifShow_reg_alert" ></register-vue>
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
      ])
    },
  }
</script>

<style>
  @import "./css/normalize.css";
  @import "./css/base.css";
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  /*-webkit-font-smoothing: antialiased;*/
  /*-moz-osx-font-smoothing: grayscale;*/
  /*text-align: center;*/
  /*color: #2c3e50;*/
  /*margin-top: 60px;*/
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

</style>
