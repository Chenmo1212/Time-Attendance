<template>

  <!--弃！！！！！！！！！！！！！！！！！！！！！！！！！-->
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
            <h3>限时{{count}}秒，超时请重试</h3>
          </div>
          <div class="bd">
            <img src="../png/cust.png" alt="">
            <qrcode></qrcode>
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
        <!--信息主体-->
        <div class="main" ref="main">

          <!-- 右键菜单栏(鼠标移出菜单自动消失) -->
          <div class="dropdown-content" v-show="isMenu" v-bind:class="classMenu"
               v-bind:style="{ top: yMenu+ 'px' , left: xMenu+ 'px' }"
               @mouseleave="mouseout">
            <div @click="isSign(classIndex, studentId)" style="border: none;">
              <i class="iconfont">&#xe67a;</i>
              <span class="text">更改状态</span>
            </div>
            <div v-if="judgeIsSign" @click="Lshow(classIndex, studentId)">
              <i class="iconfont" v-if="judgeLate">&#xe6f2;</i>
              <span class="text">设为迟到</span>
            </div>
            <div v-if="judgeIsSign" @click="Tshow(classIndex, studentId)">
              <i class="iconfont" v-if="judgeTruancy">&#xe6f2;</i>
              <span class="text">设为旷课</span>
            </div>
            <div v-if="!judgeIsSign" @click="getWorks('test1')">
              <i class="iconfont">&#xe633;</i>
              <span class="text">查看照片</span>
            </div>
            <div :class="{noLog:!isLogin}" @click="toData">
              <i class="iconfont">&#xe61b;</i>
              <span class="text">数据管理</span>
            </div>
          </div>


          <div class="box" >
            <!--获取班级个数-->
            <div v-for="(value, index1) in classMsg">
              <!--班号-->
              <div class="class_head">{{classMsg[index1].class_id}}班</div>
              <div class="class_body">

                <!--获取人数-->
                <div class="line" v-for="(value,index2) in classMsg[index1].students">
                  <div class="person-box">
                    <!--单击-->
                    <!--<div class="person" @click.stop="showMenu(index1,index2)" title="查看详情"-->
                    <!--右键点击-->
                    <!--<div class="person" title="查看详情" @contextmenu.prevent="menu" @contextmenu="setIndex(index1,index2)"-->
                    <!--悬浮-->
                    <div class="person" title="查看详情" @mouseover.prevent="menu" @mouseover="setIndex(index1,index2)"
                         :class="classMsg[index1].students[index2].isSign ? 'isSign' : 'notSign'">{{index2 + 1}}
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
          <!--<span class="pic-del" title="关闭" @click="alertDel"></span>-->
          <i class="pic-del iconfont" title="关闭" @click="alertDel">&#xe620;</i>
          <span class="pic-title">学生头像</span>
          <img :src="imgURL"/>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {mapState} from  'vuex';
  export default {
    name: "Attendance",
    data() {
      return {
        count: '',

        // 班级信息
        classMsg: [],

        // 图片弹窗
        showPic: false,

        // 图片网址
        imgURL: '',

        //点击的班级号
        classIndex: '',

        //点击的学号
        studentId: '',

        //菜单栏的判断
        judgeIsSign: true,
        judgeLate: true,
        judgeTruancy: true,

        //是否显示菜单栏
        isMenu: false,

        //菜单栏的位置
        xMenu: '',
        yMenu: '',

        //菜单栏向上还是向下
        classMenu: '',

        loader_width: 300,    // 进度条盒子宽度
        loader_height: 8,    // 进度条盒子高度
        loaded_width: 0,      // 进度条内容宽度——初始宽度
        loaded_height: 8,    // 进度条内容高度
        loader_speed: 10000,  // 进度条速度(ms)

        time: '',
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

      console.log("full", this.full);

      // 创建之前先看看仓库里有啥
      console.log('创建之前先看看仓库里有啥', this.Class_lists);

      //如果仓库为空则将本地的班级信息赋值给仓库—-------->if的表达式有疑问，为什么不能直接为空？明明他是一个数组，输出类型却为对象
      if (this.Class_lists.length === 0) {
        console.log(typeof (this.Class_lists));
        console.log('本地存储有什么：', JSON.parse(localStorage.getItem('class_lists')));
        console.log('将本地存储的班级信息赋值到仓库：');
        this.$store.commit('change', JSON.parse(localStorage.getItem('class_lists')));
        console.log('再看看仓库里有啥', this.Class_lists);
      }

      //将仓库中的班级信息赋值给classMsg----------------为安全起见，还是新建一个数组吧，就不直接从仓库里拿直接用了
      this.classMsg = this.Class_lists;
      console.log('classMsg已经被赋值为：', this.classMsg);


      //请求接口
      // this.set_time();

      //计时器
      this.forClock();

      // 进度条
      this.processbar();
    },
    mounted() {
      if(!this.full){
        this.$store.commit('SET_ATTENTION', {
          ifAlert: true,
          at_warning: '为方便您拥有更好的考勤体验，请您按下键盘F11键',
          full_screen: true,
        });
      }

      // 获取元素
      var loader = document.getElementById("loader"); // 获取进度条盒子
      var loaded = document.getElementById("loaded"); // 获取进度条内容
      // 设置宽高
      loader.style.width = this.loader_width + 'px';  // 设置盒子宽度
      loader.style.height = this.loader_height + 'px'; // 设置盒子高度
      loaded.style.width = this.loaded_width + 'px';  // 设置内容宽度
      loaded.style.height = this.loaded_height + 'px'; // 设置内容高度
      console.log("盒子当前设置宽度为:", loader.style.width);
    },

    destroyed(){
      clearTimeout(this.time);
    },
    methods: {

      endSign() {
        if (this.ShowBlock === false) {
          this.$store.commit('SET_ATTENTION', {
            ifAlert: true,  // 提示窗口
            at_warning: '当前正在考勤，确定要结束当前考勤？', // 提示语
            EndSign: true
          });
        } else {
          this.$store.commit('SET_LOADING', {isLoading: true, warning: '考勤已结束'});
          setTimeout(() => {
            this.$store.commit('SET_LOADING', false);
          }, 1000);
        }

      },

      //循环计时器60次
      forClock() {
        for (let i = 1; i < 60; i++) {
          this.clock()
        }
      },

      //数字计时器
      clock() {
        const TIME_COUNT = 10;
        if (!this.timer) {
          this.count = TIME_COUNT;
          // this.show = false;
          this.timer = setInterval(() => {
            if (this.count > 1 && this.count <= TIME_COUNT) {
              this.count--;
            } else {
              // this.show = true;
              clearInterval(this.timer);
              this.timer = null;
              //重置计时器
              this.count = 10;
              this.forClock()
            }
          }, 1000)
        }
      },


      processbar() {
        var count = (this.loader_width * 20) / this.loader_speed; // 进度条单次增加宽度（px）
        var total = 0; // 进度条累加总宽度
        var width = this.loader_width;
        this.time = setInterval(function () { // 定义计时器
          total += count;
          loaded.style.width = total + 'px';
          var d_width = loaded.style.width;
          if (parseInt(d_width) >= width) {
            var myDate = new Date(); // 显示当前日期时间
            console.log("当前时间：",myDate.toLocaleString());
            console.log("进度条满了，重置！");
            total = 0;
            loaded.style.width = total + 'px';
          }
        }, 20);
      },

      setIndex(index1, index2) {
        this.classIndex = index1;
        this.studentId = index2;
        this.judgeIsSign = !this.classMsg[index1].students[index2].isSign;
        this.judgeLate = this.Class_lists[index1].students[index2].Late;
        this.judgeTruancy = this.Class_lists[index1].students[index2].Truancy;
        this.setMenu();
      },
      menu(e) {
        console.log('鼠标右键单击元素开启右键菜单');
        //详细讲解 https://blog.csdn.net/u010885548/article/details/82260576
        this.xMenu = e.clientX; //x坐标，相对于浏览器的坐标
        this.yMenu = e.clientY;  //同上
        // let clientHeight =`${document.documentElement.clientHeight}`
      },
      setMenu() {
        let height = 200;
        if (!this.judgeIsSign) height -= 40;
        if (this.$refs.main.offsetHeight + this.$refs.main.getBoundingClientRect().top - this.yMenu <= height) {
          this.yMenu = this.yMenu - height + 30;
          // this.classMenu = "dropdown-content-negative";  // 向下排列
          this.classMenu = "dropdown-content-positive";  // 向下排列
        } else {
          this.classMenu = "dropdown-content-positive";   // 向上排列
        }
        this.isMenu = true;
        console.log("height:", height)                              // 计算后的到的菜单的高度
        console.log("main:", this.$refs.main.offsetHeight)          // main的高度
        console.log("yMenu:", this.yMenu)                           // 鼠标点击处距离顶部的距离
        console.log(this.$refs.main.getBoundingClientRect().top)   // main距离顶部的距离
      },
      //鼠标移出事件
      mouseout() {
        this.isMenu = false;
      },

      getWorks(username) {
        works(username).then(res => {
          console.log(res.data);
          this.imgURL = 'https://1.cust.edu.cn/shufa/' + res.data.data[0].pieces[0].image.url
        }).catch(error => {
          console.log(error.response)
        });
        console.log('showPic:', this.showPic);
        this.showPic = true;
        console.log('showPic:', this.showPic);
      },


      // 更改签到状态
      isSign(index1, index2) {
        // 先输出看看你是个啥
        console.log(this.classMsg[index1].students[index2].isSign);

        this.$store.commit('SET_LOADING', {isLoading: true, warning: '更改成功'});
        setTimeout(() => {
          this.$store.commit('SET_LOADING', false);
        }, 1000);

        // 取反
        this.classMsg[index1].students[index2].isSign = !this.classMsg[index1].students[index2].isSign;

        // 未签到人数改变
        // console.log(this.classMsg[index1].student[index2].isSign);
        if (this.classMsg[index1].students[index2].isSign === true) {
          this.classMsg[index1].noSign -= 1;
        } else {
          this.classMsg[index1].noSign += 1;
        }
        console.log(this.classMsg[index1].students[index2].id);

        // 数据有改变，需要改变本地存储中的数据
        localStorage.setItem('class_lists', JSON.stringify(this.classMsg));
      },



      // 关闭弹窗
      alertDel() {
        // 警告弹窗
        this.showPic = false;
      },

      // 去“数据管理”
      toData() {
        if (this.isLogin === true) {
          this.$router.push({name: 'data'});
        } else {

          console.log("classMsg————To_Data：", this.To_Data);

          this.$store.commit('SET_ATTENTION', {
            ifAlert: true,
            at_warning: '该功能需要登陆后才可使用，请先登录。',
            noLogin: true,
            To_Data: true,
          });

          console.log("classMsg————To_Data：", this.To_Data);
        }
      },

      Lshow(index1, index2) {
        console.log("迟到了");
        this.$store.commit('SET_LOADING', {isLoading: true, warning: '更改为迟到'});
        setTimeout(() => {
          this.$store.commit('SET_LOADING', false);
        }, 800);
        if (this.Class_lists[index1].students[index2].Late === true) {
          this.$store.commit('SET_LOADING', {isLoading: true, warning: '您已经选择了迟到'});
          setTimeout(() => {
            this.$store.commit('SET_LOADING', false);
          }, 1000);
        } else {
          this.Class_lists[index1].students[index2].Late = true;
          this.judgeLate = true;
          this.Class_lists[index1].students[index2].Truancy = false;
          this.judgeTruancy = false;
        }
      },
      Tshow(index1, index2) {
        console.log("旷课了");
        this.$store.commit('SET_LOADING', {isLoading: true, warning: '更改为旷课'});
        setTimeout(() => {
          this.$store.commit('SET_LOADING', false);
        }, 800);
        if (this.Class_lists[index1].students[index2].Late === false) {
          this.$store.commit('SET_LOADING', {isLoading: true, warning: '您已经选择了旷课'});
          setTimeout(() => {
            this.$store.commit('SET_LOADING', false);
          }, 1000);
        } else {
          this.Class_lists[index1].students[index2].Late = false;
          this.Class_lists[index1].students[index2].Truancy = true;
          this.judgeLate = false;
          this.judgeTruancy = true;
        }
      },
    },
    // 全局点击事件
    // updated: function () {
    //   this.globalClick(this.mouseout);
    // }
  }
</script>

<style scoped>
  .mw {
    margin: 2px auto;
    width: 1400px;
    height: 600px;
    position: relative;
    /*background-color: #aaa;*/
  }

  .left .box {
    margin-left: -50px;
  }

  .left {
    width: 535px;
    height: 650px;
    /*background-color: #ddd;*/
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

  .clip {
    /* Safari 5.1 - 6.0 */
    background: -webkit-linear-gradient(left, #f9f586, #96fbc4);
    /* Opera 11.1 - 12.0 */
    background: -o-linear-gradient(left, #f9f586, #96fbc4);
    /* Firefox 3.6 - 15 */
    background: -moz-linear-gradient(left, #f9f586, #96fbc4);
    /* 标准的语法 */
    background: linear-gradient(to right, #f9f586, #96fbc4);
    width: 10px;
    margin: 1px 0px;
    box-shadow: 0px 0px 2px #0dd2ea;
    height: 8px;
    border-radius: 20px;
  }

  .progress_bar .progress_box {
    position: absolute;
    width: 380px;
    left: 50%;
    margin-left: -190px;
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
    animation: content 10s infinite;
    -moz-animation: content 10s infinite; /* Firefox */
    -webkit-animation: content 10s infinite; /* Safari and Chrome */
    -o-animation: content 10s infinite; /* Opera */
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
    top: 50px;
    left: -50px;
    height: 100%;
    width: 535px;
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

  .right {
    margin-top: 38px;
    float: right;
    width: 850px;
    height: 600px;
    background-color: #fff;
    overflow: hidden;
  }

  /*主体，固定宽高，超出显示滚动条*/
  .right .main {
    height: 550px;
    width: 700px;
    margin: 25px auto;
    /*background-color: #F6F8F9;*/
    overflow-y: auto;

  }

  /*跟随班级长度弹性边框*/
  .main .box {
    border: #e7e7eb solid 2px;
  }

  /*班级班号*/
  .class_head {
    background-color: #e7e7eb;
    height: 25px;
    line-height: 25px;
    font-weight: 700;
    padding-left: 18px;
    margin-bottom: 5px;
  }

  /*!*班级人数所在盒子*!*/
  .class_body {
    padding-bottom: 10px;
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
    margin: 4px 0;
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

  .dropdown-content {
    display: flex;
    position: absolute;
    font-size: 14px;
    cursor: pointer;
  }

  .dropdown-content-positive {
    flex-direction: column;
  }

  .dropdown-content-negative {
    flex-direction: column-reverse;
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

  .dropdown-content .noLog {
    color: #8d8a8a;
    cursor: not-allowed; /*鼠标禁止样式*/
  }

  .line .isSign {
    background-color: #12cbb3;
  }

  .line .notSign {
    background-color: #d82828;
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

  /*====================    pic-end    ================*/


</style>
