<template>
  <div id="classMsg">
    <div class="white">
      <!--透明盒子，占空间使用-->
      <div style="height: 6.48vh;"></div>

      <!--信息主体-->
      <div class="main">
        <div class="box">

          <!--获取班级个数-->
          <div v-for="(value, index1) in classMsg">
            <!--班号-->
            <div class="class_head">{{classMsg[index1].class_id}}</div>
            <div class="class_body">

              <!--获取人数-->
              <div class="line" v-for="(value,index2) in classMsg[index1].students">
                <div class="person-box" >
                  <!--单击-->
                  <!--<div class="person" @click.stop="showMenu(index1,index2)" title="查看详情"-->
                  <!--悬浮-->
                  <!--<div class="person" title="查看详情" @mouseover.prevent="menu" @mouseover="setIndex(index1,index2)"-->
                  <!--右键点击-->
                  <div class="person" title="查看详情" @contextmenu.prevent="menu" @contextmenu="setIndex(index1,index2)"
                       :class="classMsg[index1].students[index2].isSign ? 'isSign' : 'notSign'">{{index2 + 1}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--提示弹窗-->
    <transition name="warning">
      <div class="onLoad" v-if="isLoading"><span>{{ warning }}</span></div>
    </transition>

    <transition name="picture">
      <div class="picture" v-show="showPic">
        <div class="pic-bg"></div>
        <div class="pic-wrap">
          <span class="pic-del" title="关闭" @click="alertDel"></span>
          <span class="pic-title">学生头像</span>
          <img :src="imgURL"/>
          <!--<div class="pic-bottom">-->
          <!--<div class="pic-bottom-wrap">-->
          <!--<input type="checkbox" class="checkbox" @click="checkbox">-->
          <!--<span>我知道了</span>-->
          <!--</div>-->
          <!--</div>-->

        </div>
      </div>
    </transition>

  </div>

</template>

<script>
  import {mapState} from 'vuex'
  import {getchick, anonymous, getnonchick} from "../axios/api";

  export default {
    name: "classMsg",
    data() {
      return {
        // 签到人数
        count: 0,

        // 是否弹出警告弹窗
        // ifAlert: false,

        // 提示警告语
        warning: '',
        isLoading: false,

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
      }
    },

    computed: {
      ...mapState([
        'Class_lists',
        'isLogin',
        'To_Data',
      ])
    },

    created() {

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

      //疯狂刷新已签到人员
      // this.chickInStu()
    },


    methods: {

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
          this.classMenu = "dropdown-content-negative";  // 向下排列
        } else {
          this.classMenu = "dropdown-content-positive";   // 向上排列
        }
        this.isMenu = true;
        // console.log("height:", height)                              // 计算后的到的菜单的高度
        // console.log("main:", this.$refs.main.offsetHeight)          // main的高度
        // console.log("yMenu:", this.yMenu)                          // 鼠标点击处距离顶部的距离
        // console.log(this.$refs.main.getBoundingClientRect().top)   // main距离顶部的距离
      },
      //鼠标移出事件
      mouseout() {
        this.isMenu = false;
      },


      // 更改签到状态
      isSign(index1, index2) {
        // 先输出看看你是个啥
        console.log(this.classMsg[index1].students[index2].isSign);
        this.warning = '更改成功';
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
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


      //获取学生 （未登录）
      chickNunStu() {
        const id = localStorage.getItem('res.data.body.id');
        anonymous().then(result => {
          console.log('未登录', result);
          setInterval(function () {
            getnonchick(result.data.body.key, id).then(res => {
              console.log('未登录', res);
              console.log('未登录2', res.data.body);
              for (let k in res) {
                let v = res[k];
                this.classMsg[k].students[v].push({isSign: false})
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


      //改变登录状态
      changeSign(res) {
        console.log('改变登录状态',res);

      },

      // // 显示菜单
      // showMenu(index1,index2){
      //   // console.log("12321312",this.classMsg[index1].students[index2].ifShowMenu);
      //   for (var i = 0; i < this.classMsg.length; i++){
      //     for(var j = 0; j<this.classMsg[i].students.length;j++){
      //       this.classMsg[i].students[j].ifShowMenu = false;
      //     }
      //   }
      //   console.log("ifShowMenu:",this.classMsg[index1].students[index2].ifShowMenu)
      //   this.classMsg[index1].students[index2].ifShowMenu = !this.classMsg[index1].students[index2].ifShowMenu;
      //   console.log("ifShowMenu:",this.classMsg[index1].students[index2].ifShowMenu)
      // },

      // 关闭弹窗
      alertDel() {
        // 警告弹窗
        this.showPic = false;
      },

      // 去“数据管理”
      // toData() {
      //   // if (this.Logon_status === true) {
      //     if(this.Class_lists.length === 0) {
      //
      //       this.warning = '请填全信息后考勤';
      //       this.isLoading = true;
      //       setTimeout(() => {
      //         this.isLoading = false;
      //       }, 1000);
      //
      //       this.$router.push({name: 'home'})
      //     } else {
      //       this.$router.push({name: 'data'});
      //     }
      // } else {
      //   this.ifAlert = true;
      // }
      //   },
    },


  }
</script>

<style scoped>
  * {
    padding: 0;
    margin: 0;
  }

  /*!*白色部分*!*/
  /*.white {*/
    /*width: 53.38vw;*/
    /*margin-top: 5.555vh;*/
    /*margin-left: 4.166vw;*/
    /*background-color: #fff;*/
    /*height: 85.185vh;*/
  /*}*/

  /*白色主体，固定宽高，超出显示滚动条*/
  .white .main {
    height: 72.222vh;
    width: 42vw;
    margin-left: 5.99vw;
    overflow-y: auto;
  }

  /*跟随班级长度弹性边框*/
  .white .main .box {
    border: #e7e7eb solid 2px;
  }

  /*班级班号*/
  .class_head {
    background-color: #e7e7eb;
    height: 25px;
    line-height: 25px;
    padding-left: 18px;
    margin-bottom: 0.926vh;
  }

  /*班级人数所在盒子*/
  .class_body {
    padding-bottom: 10px;
    width: 40vw;
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
    margin: 0.4vh 0;
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
    position: absolute;
    display: flex;
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
    /* box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.2); */
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

  .dropdown-content div .img {
    height: 16px;
    width: 16px;
    position: absolute;
    left: 10px;
    top: 12px;
  }

  .dropdown-content div .text {
    margin-left: 20px;
  }

  .dropdown-content div .img-Change {
    background-image: url(../png/change.png);
    -webkit-background-size: 100%;
    background-size: 100%;
  }

  .dropdown-content div .img-Data {
    background-image: url(../png/data.png);
    -webkit-background-size: 100%;
    background-size: 100%;
  }

  .dropdown-content div .img-Late {
    background-image: url(../png/check.png);
    -webkit-background-size: 100%;
    background-size: 100%;
  }

  .dropdown-content div .img-Truancy {
    background-image: url(../png/check.png);
    -webkit-background-size: 100%;
    background-size: 100%;
  }

  .dropdown-content div .img-Pic {
    background-image: url(../png/head.png);
    -webkit-background-size: 100%;
    background-size: 100%;
  }


  .line .notSign {
    background-color: #d82828;
  }

  .line .isSign {
    background-color: #12cbb3;
  }

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
    width: 40px;
    height: 40px;
    background: url(../png/tiny-delete.png) no-repeat center center;
    display: block;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 9999;
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

  .pic-bottom {
    display: block;
    text-align: center;
    width: 100%;
    margin-top: 10px;
    padding-bottom: 30px;
    font-size: 12px;
    position: absolute;
    bottom: 30px;
  }

  .pic-bottom-wrap {
    width: 272px;
    display: inline-block;
    position: absolute;
    left: 50%;
    margin-left: -150px;
  }

  .pic-bottom-wrap .checkbox {
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

  .pic-bottom-wrap span {
    padding: 0;
    margin: 0;
    color: #444;
    vertical-align: top;
    outline: none;
  }

  /*====================    pic-end    ================*/


  .noLog {
    color: #8d8a8a;
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

</style>
