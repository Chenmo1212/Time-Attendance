<template>
  <div id="qr_code">
    <div class="button-header">
      <div class="return">
        <button @click="return_home" title="返回上一界面"></button>
      </div>
      <div class="endSign">
        <button @click="endSign" title="结束签到"></button>
      </div>
    </div>

    <div class="box">
      <div class="box_header">
        <p>Tip:请使用任意具有扫一扫功能的APP进行考勤</p>
        <!--<p style="font-weight: bold; text-align: left; margin-left: 105px;">超时请重试</p>-->
        <p class="timer">限时{{count}}秒，超时请重试</p>
      </div>

      <div class="box_body">
        <!--二维码-->
        <div id="qrcode" class="code"></div>
        <!--进度条-->
        <div class="progress_bar">
          <div class="progress_box">
            <span class="progress_content"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="popIn block" v-show="showBlock">
      <div class="block_header">
        <p>Tip:别扫了，考勤结束了</p>
      </div>

      <div class="block_body">
        <!--二维码-->
        <img src="../png/home.gif" alt="" class="code">
        <p>放弃挣扎吧（左为你，右为老师）</p>
      </div>
    </div>

    <!--提示弹窗-->
    <transition name="warning">
      <div class="onLoad" v-if="isLoading === true"><span>{{ warning }}</span></div>
    </transition>

  </div>

</template>

<script type="text/javascript">
  import {mapState} from 'vuex';
  import authenticator from 'otplib/authenticator';
  import crypto from 'crypto';


  export default {
    name: "qr_code",
    data() {
      return {
        count: '',
        showBlock: false,
        seed: '',
      }
    },
    computed: {
      ...mapState([
        'isLoading',
        'warning',
      ])
    },
    created() {
      //请求接口
      // this.set_time();
      //计时器
      this.forClock()

    },
    mounted() {
      //循环二维码
      this.loopCode()
    },
    methods: {
      //结束考勤
      endSign() {
        if (this.showBlock === false) {
          this.showBlock = true;
        } else {
          this.$store.commit('SET_LOADING', {isLoading: true, warning: '考勤已结束'});
          setTimeout(() => {
            this.$store.commit('SET_LOADING', false);
          }, 1000);
        }

      },
      //返回页面
      return_home() {
        this.$router.push({name: 'home'})
      },

      //循环调用otp组件并请求相应二维码
      loopCode() {
        const result = localStorage.getItem('seed');
        console.log('qrCode', result);
        authenticator.options = {
          crypto: crypto,
          step: 7,
          window: 1
        };
        const secret = result;
        let qrcode = new QRCode('qrcode', {
          width: 328,
          height: 328,
          colorDark: "#000",
          colorLight: "#fff",
          correctLevel: QRCode.CorrectLevel.H

        });
        setInterval(function () {
          //获取id
          const id = localStorage.getItem('res.data.body.id');
          const token = authenticator.generate(secret); // 556443
          console.log('token', token);
          const url = `https://192.168.1.145:8081?val=${token}&id=${id}`;
          qrcode.makeCode(url);
        }, 100);
      },


      //循环计时器60次
      forClock() {
        for (let i = 1; i < 600; i++) {
          this.clock()
        }
      },
      //数字计时器
      clock() {
        const TIME_COUNT = 7;
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.show = false;
          this.timer = setInterval(() => {
            if (this.count > 1 && this.count <= TIME_COUNT) {
              this.count--;
            } else {
              this.show = true;
              clearInterval(this.timer);
              this.timer = null;
              //重置计时器
              this.count = 10;
              this.forClock()
            }
          }, 1000)
        }
      }



      // //定时器//获取二维码
      // set_time() {
      //   //首次获取二维码
      //   get_code().then(result => {
      //     //  push二维码
      //   }).catch(error => {
      //     console.log(error.response)
      //   });
      //   //最大请求60次
      //   let stry = '012345678901234567890123456789012345678901234567890123456789';
      //   for (let j = 0; j < stry.length; j++) {
      //
      //     (function () {
      //       let t = j + 1;
      //       let tyy = stry[j];
      //       setTimeout(function () {
      //         console.log(tyy + 'code');
      //         // 第二次及以后的二维码
      //         get_code().then(result => {
      //           //  push二维码
      //         }).catch(error => {
      //           console.log(error.response)
      //         })
      //       }, 10 * 1000 * t)
      //     })()
      //   }
      // }
      ,
    },
  }
</script>

<style scoped>
  * {
    padding: 0;
    margin: 0;
  }

  .button-header {
    position: relative;
    top: 0;
    height: 40px;
    width: 110%;
    /*background-color: #aaa;*/
  }

  .return {
    width: 40px;
    height: 40px;
    padding: 5px;
  }

  .return button {
    width: 35px;
    height: 35px;
    background: url(../png/return.svg);
    background-size: 100%;
    border: none;
    cursor: pointer;
    outline: none;
  }

  .endSign {
    position: absolute;
    right: 0;
    top: 5px;
    width: 40px;
    height: 40px;
    padding: 5px;
  }

  .endSign button {
    width: 35px;
    height: 35px;
    background: url(../png/endSign.svg);
    background-size: 100%;
    border: none;
    cursor: pointer;
    outline: none;
  }

  .box {
    text-align: center;
    margin-top: 8vh;
    margin-left: 60px;
  }

  .box_header .timer {
    font-weight: bold;
    margin-top: 5vh;
    font-size: 18px
  }

  .box_body {
    position: relative;
    margin-top: 5vh;
    text-align: center;
  }

  .box_body .code {
    display: inline-block;
    margin-bottom: 0;
    /*border: #e7e9ef 3px solid;*/
  }

  #qrcode {
    display: inline-block;
  }

  .progress_bar {
    margin-top: 3vh;
    position: relative;
  }

  .progress_bar .progress_box {
    position: absolute;
    width: 22vw;
    left: 50%;
    margin-left: -11vw;
    background: #fff;
    height: 9px;
    border-radius: 3px;
    border-left: 1px solid #e7e9ef;
    border-top: 2px solid #e7e9ef;
    border-right: 1px solid #e7e9ef;
    border-bottom: 2px solid #e7e9ef;
  }

  .progress_bar .progress_box .progress_content {
    height: 4px;
    margin: 2px 0;
    background: #1aad19;
    position: absolute;
    left: 0;
    width: 300px;
    box-shadow: 0 0 10px 1px rgba(75, 173, 67, 0.4);
    animation: content 7s infinite;
    -moz-animation: content 7s infinite; /* Firefox */
    -webkit-animation: content 7s infinite; /* Safari and Chrome */
    -o-animation: content 7s infinite; /* Opera */
  }

  /* Firefox */
  @-moz-keyframes content {
    0% {
      width: 0;
    }
    100% {
      width: 100%;
    }
  }

  /* Safari and Chrome */
  @-webkit-keyframes content {
    0% {
      width: 0;
    }
    100% {
      width: 100%;
    }
  }

  /*Opera */
  @-o-keyframes content {
    0% {
      width: 0;
    }
    100% {
      width: 100%;
    }
  }

  .popIn {
    position: absolute;
    top: 18vh;
    display: block;
    width: 38.2%;
    height: 80vh;
    text-align: center;
    background-color: #F6F8F9;
    /*border: #e7e9ef 3px solid;*/
    -webkit-animation: fadeleftIn 2s;
    animation: fadeleftIn 2s;
    -webkit-animation-name: popIn;
    animation-name: popIn;
  }

  .block .block_header p {
    font-size: 20px;
    margin-top: 10vh;
    margin-left: 60px;
  }

  .block_body {
    margin-top: 20vh;
    margin-left: 60px;
  }

  @-webkit-keyframes popIn {
    0% {
      -webkit-transform: scale3d(0, 0, 0);
      transform: scale3d(0.5, 0.5, 0.5);
      opacity: 0;
    }
    50% {
      -webkit-animation-timing-function: cubic-bezier(0.47, 0, 0.745, 0.715);
      animation-timing-function: cubic-bezier(0.47, 0, 0.745, 0.715);
    }
    100% {
      -webkit-transform: scale3d(1, 1, 1);
      transform: scale3d(1, 1, 1);
      -webkit-animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
      animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
      opacity: 1;
    }
  }

  @keyframes popIn {
    0% {
      -webkit-transform: scale3d(0, 0, 0);
      transform: scale3d(0.5, 0.5, 0.5);
      opacity: 0;
    }
    50% {
      -webkit-animation-timing-function: cubic-bezier(0.47, 0, 0.745, 0.715);
      animation-timing-function: cubic-bezier(0.47, 0, 0.745, 0.715);
    }
    100% {
      -webkit-transform: scale3d(1, 1, 1);
      transform: scale3d(1, 1, 1);
      -webkit-animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
      animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
      opacity: 1;
    }
  }

  /*@-webkit-keyframes fadeIn {*/
  /*0% {*/
  /*opacity: 0; !*初始状态 透明度为0*!*/
  /*}*/
  /*50% {*/
  /*opacity: 0; !*中间状态 透明度为0*!*/
  /*}*/
  /*100% {*/
  /*opacity: 1; !*结尾状态 透明度为1*!*/
  /*}*/
  /*}*/

  /*.block {*/
  /*display: inline-block;*/
  /*width: 18.75vw;*/
  /*height: 37.696vh;*/
  /*margin-bottom: 0;*/
  /*border: #e7e9ef 3px solid;*/
  /*-webkit-animation-name: fadeIn; !*动画名称*!*/
  /*-webkit-animation-duration: 10s; !*动画持续时间*!*/
  /*-webkit-animation-iteration-count: 1; !*动画次数*!*/
  /*-webkit-animation-delay: 0s; !*延迟时间*!*/
  /*}*/

  /*@-webkit-keyframes fadeInOut {*/
  /*0% {*/
  /*opacity:0;*/
  /*}*/
  /*25% {*/
  /*opacity:1;*/
  /*}*/
  /*50% {*/
  /*opacity: 1;*/
  /*}*/
  /*75% {*/
  /*opacity:1;*/
  /*}*/
  /*}*/
  /*.code {*/
  /*display: inline-block;*/
  /*width: 18.75vw;*/
  /*height: 37.696vh;*/
  /*margin-bottom: 0;*/
  /*border: #e7e9ef 3px solid;*/
  /*position:absolute;*/
  /*-webkit-animation-name: fadeInOut;*/
  /*-webkit-animation-timing-function: ease-in-out;*/
  /*-webkit-animation-iteration-count: infinite;*/
  /*-webkit-animation-duration: 12s; !*动画持续时间*!*/
  /*-webkit-animation-direction: alternate;*/
  /*}*/
</style>
