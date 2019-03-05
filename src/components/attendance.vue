<template>
  <div id="Attendance">
    <div class="mw">
      <!-- 左边 begin -->
      <div class="left">
        <div class="endSign">
          <i class="iconfont" @click="endSign" title="结束签到">&#xe7d1;</i>
        </div>
        <div class="box">
          <div class="hd">
            <h4>Tip:请使用任意具有扫一扫功能的APP进行考勤</h4>
            <h3>限时{{timeRemaining}}秒，超时请重试</h3>
          </div>
          <div class="bd">
            <div id="qrcode" @click="openClientPage"></div>

            <div class="table">
              <div class="progress-bar">
                <div id='loader'>
                  <div class='clip' id="loaded">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--结束考勤 begin-->
          <div class="popIn block" v-show="ShowBlock">
            <div class="block_header">
              <p>Tip:别扫了，考勤结束了</p>
            </div>

            <div class="block_body">
              <!--二维码-->
              <img src="../png/home.gif" alt="" class="code">
              <p>放弃挣扎吧（左为你，右为老师）</p>
            </div>
          </div>
          <!--结束考勤 end-->
        </div>
      </div>
      <!--左边 end-->
      <!--右边 begin-->
      <div class="right">
        <div class="main">
          <div class="main-header">
            <h3>考勤班级状态</h3>
            <div class="menu bounce1" v-show="isMenu" id="bounce">
              <ul>
                <li @click="toData()" v-show="!ifSign" :class="{'noLogin': !isLogin,'menu-main': true}">
                  <i class="iconfont">&#xe61b;</i>
                  <span>数据管理</span>
                </li>
                <li class="spacer" v-show="!ifSign"></li>
                <li class="menu-main" @click="getWorks('test1')" v-show="!ifSign">
                  <i class="iconfont">&#xe633;</i>
                  <span>查看照片</span>
                </li>
                <li class="spacer" v-show="!ifSign"></li>
                <li class="menu-main" @click="showLate(classIndex, studentId)" v-show="ifSign">
                  <i class="iconfont" v-if="ifLate">&#xe6f2;</i>
                  <span>设为迟到</span>
                </li>
                <li class="spacer" v-show="ifSign"></li>
                <li class="menu-main" @click="showTruancy(classIndex, studentId)" v-show="ifSign">
                  <i class="iconfont" v-if="ifTruancy">&#xe6f2;</i>
                  <span>设为旷课</span>
                </li>
                <li class="spacer" v-show="ifSign"></li>
                <li class="menu-main" @click="setSign(classIndex, studentId)">
                  <i class="iconfont">&#xe67a;</i>
                  <span>更改状态</span>
                </li>

              </ul>
            </div>
          </div>
          <div class="spacer"></div>
          <!-- main-body begin -->
          <div class="main-body" ref="main">
            <div class="box">
              <!--获取班级个数-->
              <div v-for="(value, index1) in classMsg">
                <!--班号-->
                <div class="class_head">{{classMsg[index1].class_id}}班</div>
                <div class="class_body">
                  <!--获取人数-->
                  <div class="line" v-for="(value,index2) in classMsg[index1].students">
                    <div :class="{ person_box: classMsg[index1].students[index2].checkBtn}">
                      <!--单击-->
                      <div class="person" @click.stop="setIndex(index1,index2)" title="查看详情"
                           :class="classMsg[index1].students[index2].ifSign ? 'isSign' : 'notSign'">{{index2 + 1}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--提示弹窗-->
    <!--<transition name="warning">-->
    <!--<div class="onLoad" v-if="isLoading"><span>{{ warning }}</span></div>-->
    <!--</transition>-->

    <transition name="picture">
      <div class="picture" v-show="showPic">
        <div class="pic-bg"></div>
        <div class="pic-wrap">
          <i class="pic-del iconfont" title="关闭" @click="delAlert">&#xe620;</i>
          <span class="pic-title">学生头像</span>
          <img :src="imgURL"/>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import authenticator from 'otplib/authenticator';
  import crypto from 'crypto';
  // import {works} from "../axios/api";
  import {getchick, anonymous, getnonchick} from "../axios/api";

  export default {
    name: "Attendance",
    data() {
      return {
        //剩余时长
        timeRemaining: '',

        timeUsed: '',

        // 班级信息
        classMsg: [],

        // 图片弹窗
        showPic: false,

        // 图片网址
        imgURL: '',

        url: '',

        //点击的班级号
        classIndex: '',

        //点击的学号
        studentId: '',

        //菜单栏的判断
        ifSign: true,
        ifLate: true,
        ifTruancy: true,

        //是否显示菜单栏
        isMenu: false,

        // 进度条
        loader_width: 300,    // 进度条盒子宽度
        loader_height: 8,    // 进度条盒子高度
        loaded_width: '',      // 进度条内容宽度——初始宽度
        loaded_height: 8,    // 进度条内容高度
        loader_speed: 10000,  // 进度条速度(ms)
        time: '',
        checkBtn: true,
        ani_status: 0,
      }
    },
    computed: {
      ...mapState([
        'isLoading',
        'warning',
        'EndSign',
        'ShowBlock',
        'Class_lists',
        'isLogin',
        'To_Data',
        'full_screen',
        'full',
      ])
    },
    created() {

      // 创建之前先看看仓库里有啥
      console.log('创建之前先看看仓库里有啥', this.Class_lists);

      //如果仓库为空则将本地的班级信息赋值给仓库—-------->if的表达式有疑问，为什么不能直接为空？明明他是一个数组，输出类型却为对象
      if (this.Class_lists.length === 0) {
        this.$store.commit('change', JSON.parse(localStorage.getItem('class_lists')));
      }

      //将仓库中的班级信息赋值给classMsg----------------为安全起见，还是新建一个数组吧，就不直接从仓库里拿直接用了
      this.classMsg = this.Class_lists;
      console.log('classMsg已经被赋值为：', this.classMsg);
      // 进度条
      this.processBar();
    },
    mounted() {
      //判断登陆状态
      if (this.$store.state.isLogin) {
        console.log('已登录');
        this.chickInStu()

      } else {
        console.log('未登录');
        this.chickNunStu()
      }
      // 获取元素
      var loader = document.getElementById("loader"); // 获取进度条盒子
      var loaded = document.getElementById("loaded"); // 获取进度条内容
      // 设置宽高
      loader.style.width = this.loader_width + 'px';  // 设置盒子宽度
      loader.style.height = this.loader_height + 'px'; // 设置盒子高度
      loaded.style.width = '';  // 设置内容宽度
      loaded.style.height = this.loaded_height + 'px'; // 设置内容高度
      console.log("盒子当前设置宽度为:", loader.style.width);

      //循环二维码
      console.log("loopCode open");
      this.loopCode();
    },
    destroyed() {
      clearTimeout(this.time);
    },
    methods: {

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
        const that = this;
        setInterval(function () {
          //获取id
          const id = localStorage.getItem('res.data.body.id');
          const token = authenticator.generate(secret); //
          console.log('token', token);
          let baseUrl = window.location.origin;
          if (window.location.origin.match(/1.cust.edu.cn/)) {
            baseUrl += '/quickauth'
          }
          const url = `${baseUrl}/static/phone/index.html?val=${token}&id=${id}`;
          that.url = url;
          qrcode.makeCode(url);
          that.timeUsed = authenticator.timeUsed();
          that.timeRemaining = authenticator.timeRemaining();
          // console.log(that.timeRemaining);
        }, 100);
      },
      // 删除选中按钮
      clearCheckBtn() {
        for (var i = 0; i < this.classMsg.length; i++) {
          for (var j = 0; j < this.classMsg[i].students.length; j++)
            this.classMsg[i].students[j].checkBtn = false;
        }
      },
      // 关闭弹窗
      delAlert() {
        // 警告弹窗
        this.showPic = false;
      },
      endSign() {
        if (this.ShowBlock === false) {
          this.setAttention("当前正在考勤，确定要结束当前考勤？", {EndSign: true});
          // this.$store.commit("")
        } else {
          this.setWarning('考勤已结束');
        }
      },
      // 进度条
      processBar() {
        const that = this;
        this.time = setInterval(function () {
          // console.log(that.timeUsed);
          let total = ( that.timeUsed) / 6* 300;
          this.loaded.style.width =  total +'px';
          // console.log("total:" +total);
          // console.log('width'+this.loaded_width)
        }, 20);
      },


      //获取学生 （未登录）
      chickNunStu() {
        const id = localStorage.getItem('res.data.body.id');
        const that = this;
        anonymous().then(result => {
          console.log('未登录', result);
          setInterval(function () {
            getnonchick(result.data.body.key, id).then(res => {
              console.log('未登录', res);
              console.log('未登录2', res.data.body);
              for (let class_id in res.data.body) {
                let students = res.data.body[class_id];
                students.forEach((s) => {
                  that.setSign(class_id, s.id);
                })
                // this.classMsg[k].students[v].push({isSign: false})
              }
              //
            }).catch(error => {
              console.log(error)
            })
          }, 5000)
        }).catch(error => {
          console.log(error)
        })
      },

      // 获取学生0.5秒请求一次(已登录)
      chickInStu() {
        setInterval(function () {
          getchick().then(result => {
            console.log('已登录', result)
            this.changeSign(result)
            for (let k in result) {
              let v = result[k];
              this.classMsg[k].students[v].push({isSign: true})
            }
            // this.classMsg[index1].student[index2].push({isSign: true})
          }).catch(error => {
            console.log(error)
          })
        }, 5000);

      },


      setIndex(index1, index2) {
        var student = this.classMsg[index1].students[index2];
        this.clearCheckBtn(index1, index2);
        this.showMenu(index1, index2);
        this.classIndex = index1;
        this.studentId = index2;
        this.ifSign = !student.ifSign;
        this.ifLate = student.Late;
        this.ifTruancy = student.Truancy;
      },

      showMenu(index1, index2) {
        var student = this.classMsg[index1].students[index2];
        if (this.classIndex === index1 && this.studentId === index2 && this.isMenu === true) {
          this.isMenu = false;
          student.checkBtn = false;
        } else {
          this.isMenu = true;
          student.checkBtn = true;
          this.setAnimation();
        }
      },
      setAnimation() {
        var ani_icon = document.getElementById('bounce');
        if (this.ani_status === 1) {
          ani_icon.className = 'menu bounce1';
          this.ani_status = 2;
        } else {
          ani_icon.className = 'menu bounce2';
          this.ani_status = 1;
        }
      },
      // 设置提示
      setAttention(msg, obj) {
        this.$store.commit('SET_ATTENTION', {
          ifAlert: true,  // 提示窗口
          at_warning: msg, // 提示语
          EndSign: obj.EndSign,
          noLogin: obj.noLogin,
          To_Data: obj.To_Data,
        });
      },
      // 设置警告
      setWarning(msg) {
        this.$store.commit('SET_LOADING', {isLoading: true, warning: msg});
        setTimeout(() => {
          this.$store.commit('SET_LOADING', false);
        }, 1000);
      },
      // 更改签到状态
      setSign(index1, index2) {
        const classroom = this.classMsg.find((c) => { return c.class_id == index1 })
        const student = classroom.find((s) => { return s.id == index2 })

        this.setWarning('更改成功');
        student.ifSign = !student.ifSign;
        student.ifSign === true ? classroom.noSign -= 1 : classroom.noSign += 1;
        this.ifSign = !student.ifSign;
        // 数据有改变，需要改变本地存储中的数据
        localStorage.setItem('class_lists', JSON.stringify(this.classMsg));
      },

      showLate(index1, index2) {
        const student = this.Class_lists[index1].students[index2];
        this.setWarning('更改为迟到');
        if (student.Late === true) {
          this.setWarning('您已经选择了迟到');
        } else {
          student.Late = true;
          this.ifLate = true;
          student.Truancy = false;
          this.ifTruancy = false;
        }
      },

      showTruancy(index1, index2) {
        console.log("旷课了");
        const student = this.Class_lists[index1].students[index2];
        this.setWarning('更改为旷课');
        if (this.Class_lists[index1].students[index2].Late === false) {
          this.setWarning('您已经选择了旷课');
        } else {
          student.Late = false;
          student.Truancy = true;
          this.ifLate = false;
          this.ifTruancy = true;
        }
      },
      // 去“数据管理”
      toData() {
        this.isLogin ?
          this.$router.push({name: 'data'}) :
          this.setAttention('该功能需要登陆后才可使用，请先登录。', {noLogin: true, To_Data: true});
      },

      openClientPage() {
        alert(this.url);
      },
    },
  }
</script>

<style scoped>
  @import "../css/css3.css";

  .mw {
    margin: 2px auto;
    width: 1400px;
    height: 600px;
    position: relative;
  }

  .left .box {
    margin-left: -50px;
  }

  .left {
    width: 535px;
    height: 650px;
    float: left;
  }

  .endSign {
    height: 100px;
  }

  .endSign i {
    float: right;
    padding: 10px;
    font-size: 30px;
    color: #8d8a8a;
    cursor: pointer;
  }

  .hd {
    text-align: center;
  }

  .hd h4 {
    height: 60px;
  }

  .hd h3 {
    font-weight: 700;
    font-size: 18px;
    height: 60px;
  }

  .bd {
    text-align: center;
  }

  .bd img {
    height: 350px;
    width: 350px;
    border: #e7e9ef 3px solid;
  }

  .table {
    margin-top: 20px;
  }

  #loader {
    border-radius: 30px;
    background-color: #f9f7f7;
    border: 1px solid #f1f0f0;
    padding: 0px 2px;
    display: inline-block;
    border-left: 1px solid #e7e9ef;
    border-top: 2px solid #e7e9ef;
    border-right: 1px solid #e7e9ef;
    border-bottom: 2px solid #e7e9ef;
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

  .popIn {
    position: absolute;
    top: 50px;
    left: -50px;
    height: 100%;
    width: 535px;
    text-align: center;
  }

  .right {
    margin-top: 38px;
    float: right;
    width: 850px;
    height: 600px;
    background-color: #fff;
    overflow: hidden;
  }

  .main {

    margin: 30px auto;
    width: 700px;
  }

  .main-header {
    height: 40px;
    line-height: 40px;
    background-color: #F6F8F9;
    border: 1px solid #c9cace;
    margin-bottom: 5px;
  }

  .main-header h3 {
    margin-left: 10px;
    display: inline-block;
    vertical-align: top;
    font-size: 16px;
    font-weight: 700;
    color: #1aad19;
  }

  .main-header .menu {
    float: right;
    margin-right: 20px;
    display: inline-block;
    vertical-align: top;
  }

  .main-header .menu .iconfont {
    font-size: 12px;
  }

  .main-header .menu ul {
    margin-top: 10px;
  }

  .main-header .menu li {
    float: right;
    cursor: pointer;
  }

  .main-header .menu li:hover {
    color: #1aad19;
  }

  .main-header .menu .spacer {
    height: 15px;
    width: 1px;
    background-color: #aaa;
    margin-top: 3px;
  }

  .main-header .menu .menu-main {
    font-size: 12px;
    line-height: 20px;
    padding: 0 15px;
    margin: 0 3px;
  }

  /*主体，固定宽高，超出显示滚动条*/
  .right .main-body {
    height: 500px;
    overflow-y: auto;
  }

  /*跟随班级长度弹性边框*/
  .main-body .box {
    border: 1px solid #c9cace;
  }

  /*班级班号*/
  .class_head {
    background-color: #F6F8F9;
    height: 25px;
    line-height: 25px;
    font-weight: 700;
    padding-left: 18px;
    margin-bottom: 10px;
  }

  /*班级人数所在盒子*/
  .class_body {
    width: 675px;
  }

  /*每个学号所在盒子*/
  .line {
    text-align: center;
    display: inline-block;
    width: 10%;
    height: 30px;
    font-size: 14px;
    border-bottom: #e7e7eb solid 1px;
    border-top: #e7e7eb solid 1px;
    margin-bottom: 10px;
  }

  .person_box {
    border: 1px solid #96c2f1;
    background: #eff7ff;
    margin: -1px;
  }

  /*圆形*/
  .line .person {
    height: 30px;
    line-height: 30px;
    width: 30px;
    display: inline-block;
    border-radius: 15px;
    color: white;
    vertical-align: middle;
    cursor: pointer;
  }

  .dropdown-content div {
    position: relative;
    display: block;
    width: 110px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background-color: #fff;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.2);
    border-top: #e7e7eb solid 1px;
    cursor: pointer;
  }

  .dropdown-content div:hover {
    background-color: #edeef0;
  }

  .dropdown-content div span {
    display: inline-block;
    vertical-align: top;
  }

  .dropdown-content i {
    position: absolute;
    font-size: 14px;
    padding-right: 4px;
    display: inline-block;
    vertical-align: middle;
  }

  .dropdown-content div .text {
    margin-left: 20px;
  }

  .right .main-header .noLogin {
    color: #8d8a8a;
    cursor: not-allowed;
  }

  .right .main-header .noLogin:hover {
    color: #8d8a8a;
  }

  .main .spacer {
    margin-top: -1px;
    border-bottom: 1px solid #c9cace;
  }

  .line .isSign {
    background-color: #47d156;
  }

  .line .isSign:hover {
    background-color: #7BD189;
  }

  .line .notSign {
    background-color: #f4362a;
    /*background-color: #F78989;*/
  }

  .line .notSign:hover {
    background-color: #F4706D;
  }

  /*====================    pic-begin    ================*/
  .picture {
    /*display: none;*/
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 99;
  }

  .pic-bg {
    width: 100%;
    height: 100%;
    background: #000;
    filter: alpha(opacity=50);
    opacity: .5;
  }

  .pic-wrap {
    position: absolute;
    padding: 0.5em;
    max-width: 50%;
    height: 90%;
    left: 50%;
    top: 5%;
    margin-left: -25%;
    background: #fff;
    border-radius: 2px;
    -webkit-animation: alert .3s;
    animation: alert .3s;
    width: 100%;
  }

  .pic-del {
    cursor: pointer;
    float: right;
    padding: 4px;
    font-size: 30px;
    color: #8d8a8a;
  }

  .pic-title {
    cursor: pointer;
    /*width: 60px;*/
    height: 40px;
    display: block;
    margin: 50px auto;
    z-index: 101;
    font-size: 26px;
    text-align: center;
  }

  #qrcode {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /*====================    pic-end    ================*/


</style>
