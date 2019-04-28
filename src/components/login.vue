<template>
  <div id="login">
    <div class="login-alert">
      <div class="login-alert-bg"></div>
      <div class="login-alert-wrap">
        <!--<span class="login-alert-del" title="关闭" @click="alertDel"></span>-->
        <i class="login-alert-del iconfont" title="关闭" @click="alertDel">&#xe620;</i>
        <div class="login-alert-logo">快签到智能考勤</div>
        <div class="login-alert-tip">
          <div class="login-tip-line1"></div>
          <p>请使用账号密码登录</p>
          <div class="login-tip-line2"></div>
        </div>
        <form class="login-alert-form">
          <input type="text" v-model="login_acc" placeholder="请输入您的手机号码" class="login-form-input">
          <input type="password" v-model="login_pwd" placeholder="请输入密码" class="login-form-input" @keyup.enter="Login">
          <button class="alert-form-signIn" @click.prevent="Login">登录</button>
        </form>
        <div class="login-alert-bottom">
          <div class="login-alert-bottom-wrap">
            <button class="login-alert-fpwd" @click="lost_login_pwd">忘记密码»</button>
            <p>
              还没有账号？
              <button class="switch-to-reg" @click="toReg">点击注册»</button>
            </p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex';
  import {login} from "../axios/api";


  export default {
    name: "login",
    data() {
      return {
        // 是否弹出登录窗口
        // ifShow_login_alert: true,

        // 登录时的输入框
        login_acc: '',
        login_pwd: '',

        // 提示警告语
        // warning: '',
      }
    },
    computed: {
      ...mapState([
        'Class_lists',
        'isWarning',
        'isLogin',
        'isAlert',
        'warning',
        'account',
        'password',
        'ifShow_login_alert',
        'ifShow_reg_alert',
        'To_Data',
      ])
    },
    created() {
      this.login_acc = this.account;
      this.login_pwd = this.password;
    },
    methods: {
      ...mapActions([
        'setWarn',
      ]),

      // 关闭弹窗
      alertDel() {
        // 登录弹窗
        this.$store.commit('SHOW_LOGIN', false);
        this.$store.commit('SET_ATTENTION', false);
        console.log('ifShow_login_alert:', this.ifShow_login_alert);
        // this.ifShow_login_alert = false;
      },
      // 登录界面
      Login() {
        // 判断账号密码是否为空
        if (this.login_acc === '' || this.login_pwd === '') {
          this.setWarn("账号密码不得为空");
          this.login_acc = '';
          this.login_pwd = '';
        } else {
          //去登陆
          login(this.login_acc, this.login_pwd,).then(result => {
            console.log(result);
            if (result.data.ok) {
              localStorage.setItem('result.data.body.key', result.data.body.key);
              // console.log('key'+ result.data.body.key);
              // console.log(this.store.state.isLogin);
              this.setWarn("登陆成功");
            } else {
              this.setWarn("账号或密码错误");
            }
            //向全局抛出key
          }).catch(error => {
            console.log(error);
            console.log(error.result)
          });
          this.$store.commit('SET_LOGIN', true);
          this.$store.commit('SET_ATTENTION', false);
          this.$store.commit('SHOW_LOGIN', false);
          this.$store.commit('SET_ATTENTION', false);
        }
      },

      // 找回密码
      lost_login_pwd() {
        this.setWarn("别找了，瞎填就好");
      },

      // 显示注册界面
      toReg() {
        console.log("去注册");
        this.$store.commit('SHOW_LOGIN', false);
        this.$store.commit('SHOW_REGISTER', true);
        // console.log('ifShow_reg_alert:', this.ifShow_reg_alert);
      },
    }
  }
</script>

<style scoped>

  /*====================    login-begin     ================*/
  .login-alert {
    /*display: none;*/
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 100;
  }

  .login-alert button {
    border: none;
    /*background: none;*/
  }

  .login-alert-bg {
    width: 100%;
    height: 100%;
    background: #000;
    filter: alpha(opacity=50);
    opacity: .5;
  }

  .login-alert-wrap {
    position: absolute;
    max-width: 420px;
    height: 330px;
    left: 50%;
    top: 25%;
    margin-left: -210px;
    background: #fff;
    border-radius: 2px;
    -webkit-animation: alert .3s;
    animation: alert .3s;
    width: 100%;
  }

  .login-alert-del {
    cursor: pointer;
    float: right;
    padding: 4px;
    font-size: 30px;
    color: #8d8a8a;
  }

  .login-alert-logo {
    margin-top: 50px;
    text-align: center;
    font-size: 20px;
    color: #1aad19;
    /*font-weight: bold;*/
  }

  .login-alert-tip {
    color: #8d8a8a;
    font-size: 14px;
    width: 100%;
    height: 20px;
    margin-top: 20px;
  }

  .login-tip-line1 {
    margin-left: 73px;
    width: 52px;
    height: 10px;
    border-bottom: 1px solid #E5DEDE;
    float: left;
  }

  .login-alert-tip p {
    display: block;
    float: left;
    margin: 0 22px;
    width: 126px;
    text-align: center;
  }

  .login-tip-line2 {
    width: 52px;
    height: 10px;
    border-bottom: 1px solid #E5DEDE;
    float: left;
  }

  .login-alert-form {
    display: block;
    text-align: center;
  }

  .login-form-input {
    display: inline-block;
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
    margin-top: 10px;
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
  .alert-form-signIn:hover {
    background-color: #2F9833;
  }
  .login-alert-bottom {
    display: block;
    text-align: center;
    width: 100%;
    margin-top: 10px;
    padding-bottom: 30px;
    font-size: 12px;

  }

  .login-alert-bottom-wrap {
    width: 272px;
    display: inline-block;
  }

  .login-alert-bottom-wrap button {
    background: none;
    cursor: pointer;
  }

  .login-alert-fpwd {
    display: block;
    float: left;
    color: #1aad19;
  }

  .login-alert-bottom-wrap p {
    display: block;
    float: right;
    color: #444;
  }

  .switch-to-reg {
    color: #1aad19;
  }

  /*====================    login-end     ================*/
</style>
