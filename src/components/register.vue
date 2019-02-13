<template>
  <div id="register">
    <transition name="register">
      <div class="reg-alert" v-show="ifShow_reg_alert">
        <div class="reg-alert-bg"></div>
        <div class="reg-alert-wrap">
          <span class="reg-alert-del" title="关闭" @click="alertDel"></span>
          <div class="reg-alert-logo">欢迎注册</div>
          <div class="reg-alert-tip">
            <div class="alert-tip-line1"></div>
            <p>迅捷智能考勤系统</p>
            <div class="alert-tip-line2"></div>
          </div>
          <form class="reg-alert-form">
            <!--<input type="text" v-model="name" placeholder="昵称" class="reg-form-input" title="用户名长度至少6位,且由字母、数字、下划线组成"-->
                   <!--@keyup.enter="Reg">-->
            <input type="text" title="该手机号可用于找回密码" v-model="phone" placeholder="手机号码（账号）" class="reg-form-input"
                   maxlength="11" @keyup.enter="Reg">
            <input type="password" v-model="reg_pwd" placeholder="密码" class="reg-form-input" maxlength="16"
                   title="密码长度至少8位,且由字母、数字、小数点组成" @keyup.enter="Reg">

            <input type="text" placeholder="验证码" v-model="code" class="form-input-code" maxlength="6" title="6位纯数字">
            <button class="form-input-button" @click="getCode">获取验证码</button>
            <button class="alert-form-signIn" @click="Reg">注册</button>
          </form>
          <div class="reg-alert-bottom">
            <div class="reg-alert-bottom-wrap">
              <input type="checkbox" class="checkbox" @click="checkbox">
              <span>我已阅读并同意相关服务条款和隐私政策</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {mapState} from 'vuex';

  export default {
    name: "register",
    data() {
      return {
        // 是否弹出注册窗口
        ifShow_reg_alert: true,

        // 注册时的输入框
        name: '',
        reg_pwd: '',
        phone: '',
        code: '',

        // 服务条款
        checkMsg: false,
      }
    },
    computed: {
      ...mapState([
        'isLogin',
        'warning',
        'account',
        'password',
      ])
    },
    methods: {
      // 关闭弹窗
      alertDel() {
        // 注册弹窗
        this.$store.commit('SHOW_REGISTER', false);
        console.log('ifShow_reg_alert:', this.ifShow_reg_alert);
        // this.ifShow_reg_alert = false;
      },

      // 注册
      Reg() {
        // 昵称
        var regName = new RegExp("^([a-z]|[A-Z]|[0-9]|_){6,}$");
        // 密码
        var pwd = new RegExp("^([a-z]|[A-Z]|[0-9]|.){8,}$")
        // 手机号码
        var reg_phone = new RegExp("^1(3|4|5|7|8)\\d{9}$");
        // 验证码
        var reCode = new RegExp("^\\d{6}$");

        // 判断是否为空
        if (this.name === '' || this.reg_pwd === '' || this.phone === '' || this.code === '') {
          this.$store.commit('SET_LOADING', {isLoading: true, warning: '请将信息输入完整'});
          setTimeout(() => {
            this.$store.commit('SET_LOADING', false);
          }, 1000);
        } else {
          // 服务条款
          if (this.checkMsg) {
            // 账号判断
            if (regName.test(this.name)) {
              // 密码判断
              if (pwd.test(this.reg_pwd)) {
                // 判断手机号码
                if (reg_phone.test(this.phone)) {
                  // 判断验证码
                  if (reCode.test(this.code)) {
                    this.$store.commit('SET_LOADING', {isLoading: true, warning: '注册成功,请登录'});
                    setTimeout(() => {
                      this.$store.commit('SET_LOADING', false);
                    }, 1000);
                    this.ifShow_reg_alert = false;
                    this.$store.commit('SET_ACCOUNT', {account: this.phone, password: this.reg_pwd});
                    this.$router.push({name: 'login'});
                  } else {
                    // 验证码不合理
                    this.$store.commit('SET_LOADING', {isLoading: true, warning: '验证码输入不合法！'});
                    setTimeout(() => {
                      this.$store.commit('SET_LOADING', false);
                    }, 1000);
                    this.code = '';
                  }
                } else {
                  // 手机号码不合理
                  this.$store.commit('SET_LOADING', {isLoading: true, warning: '手机输入不合法！'});
                  setTimeout(() => {
                    this.$store.commit('SET_LOADING', false);
                  }, 1000);
                  this.phone = '';
                }
              } else {
                // 密码不合理
                this.$store.commit('SET_LOADING', {isLoading: true, warning: '密码输入不合法！'});
                setTimeout(() => {
                  this.$store.commit('SET_LOADING', false);
                }, 1000);
                this.reg_pwd = '';
              }
            } else {
              // 账号不合理
              this.$store.commit('SET_LOADING', {isLoading: true, warning: '昵称输入不合法！'});
              setTimeout(() => {
                this.$store.commit('SET_LOADING', false);
              }, 1000);
              this.name = '';
            }
          } else {
            this.$store.commit('SET_LOADING', {isLoading: true, warning: '请同意服务条款！'});
            setTimeout(() => {
              this.$store.commit('SET_LOADING', false);
            }, 1000);
          }
        }


      },

      // 获取验证码
      getCode() {
        this.$store.commit('SET_LOADING', {isLoading: true, warning: '请同意服务条款！'});
        setTimeout(() => {
          this.$store.commit('SET_LOADING', false);
        }, 1000);
      },

      // 服务条款
      checkbox() {
        this.checkMsg = !this.checkMsg;

        if (this.checkMsg) {
          this.$store.commit('SET_LOADING', {isLoading: true, warning: '您已同意！'});
          this.isLoading = true;
          setTimeout(() => {
            this.$store.commit('SET_LOADING', false);
          }, 1000);
        } else {
          this.$store.commit('SET_LOADING', {isLoading: true, warning: '您已取消同意！'});
          setTimeout(() => {
            this.$store.commit('SET_LOADING', false);
          }, 1000);
        }


      },
    }
  }
</script>

<style scoped>
  /*====================    reg-begin     ================*/
  .reg-alert {
    /*display: none;*/
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 100;
  }

  .reg-alert button {
    border: none;
    /*background: none;*/
  }

  .reg-alert-bg {
    width: 100%;
    height: 100%;
    background: #000;
    filter: alpha(opacity=50);
    opacity: .5;
  }

  .reg-alert-wrap {
    position: absolute;
    max-width: 500px;
    height: 420px;
    left: 50%;
    top: 15%;
    margin-left: -250px;
    background: #fff;
    border-radius: 2px;
    -webkit-animation: alert .3s;
    animation: alert .3s;
    width: 100%;
  }

  .reg-alert-del {
    cursor: pointer;
    width: 40px;
    height: 40px;
    background: url(../png/tiny-delete.png) no-repeat center center;
    display: block;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 101;
  }

  .reg-alert-logo {
    margin-top: 50px;
    text-align: center;
    font-size: 20px;
    color: #1aad19;
    /*font-weight: bold;*/
  }

  .reg-alert-tip {
    color: #8d8a8a;
    font-size: 14px;
    width: 100%;
    height: 20px;
    margin-top: 20px;
  }

  .alert-tip-line1 {
    margin-left: 113px;
    width: 52px;
    height: 10px;
    border-bottom: 1px solid #E5DEDE;
    float: left;
  }

  .reg-alert-tip p {
    display: block;
    float: left;
    margin: 0 22px;
    width: 126px;
    text-align: center;
  }

  .alert-tip-line2 {
    width: 52px;
    height: 10px;
    border-bottom: 1px solid #E5DEDE;
    float: left;
  }

  .reg-alert-form {
    display: block;
    text-align: center;
    margin-top: 10px;
  }

  .reg-form-input {
    display: block;
    padding: 0 10px;
    height: 36px;
    font-size: 16px;
    line-height: 1;
    color: #777;
    background: #FCFCFC;
    border: 1px solid #CCC;
    border-radius: 3px;
    width: 250px;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, .05);
    -webkit-transition: color .2s linear, border-color .3s linear;
    outline: none;
    margin-top: 20px;
    margin-left: 114px;
  }

  .form-input-code {
    display: inline-block;
    padding: 0 10px;
    height: 36px;
    font-size: 16px;
    line-height: 1;
    color: #777;
    background: #FCFCFC;
    border: 1px solid #CCC;
    border-radius: 3px;
    width: 95px;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, .05);
    -webkit-transition: color .2s linear, border-color .3s linear;
    outline: none;
    margin-top: 20px;
  }

  .form-input-button {
    display: inline-block;
    padding: 0 10px;
    height: 36px;
    font-size: 16px;
    line-height: 1;
    color: #fff;
    background: #1aad19;
    border: 1px solid #CCC;
    border-radius: 5px;
    width: 150px;
    outline: none;
    margin-top: 20px;
  }

  .alert-form-signIn {
    width: 272px;
    height: 36px;
    display: inline-block;
    background-color: #1aad19;
    color: #fff;
    text-align: center;
    line-height: 36px;
    font-size: 18px;
    border-radius: 5px;
    margin-top: 15px;
  }

  .reg-alert-bottom {
    display: block;
    text-align: center;
    width: 100%;
    margin-top: 10px;
    padding-bottom: 30px;
    font-size: 12px;
  }

  .reg-alert-bottom-wrap {
    width: 272px;
    display: inline-block;
    position: absolute;
    left: 50%;
    margin-left: -150px;
  }

  .reg-alert-bottom-wrap .checkbox {
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

  .reg-alert-bottom-wrap span {
    padding: 0;
    margin: 0;
    /*display: inline-block;*/
    /*float: right;*/
    color: #444;
    vertical-align: top;
    outline: none;
  }

  /*====================    reg-end     ================*/

</style>
