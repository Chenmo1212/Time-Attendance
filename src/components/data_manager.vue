<template>
  <div id="data_mg">
    <!-- title-tab begin -->
    <div class="title-tab w">
      <ul>
        <li class="selected" id="tab1" @click="choosePage(1)">当前考勤</li>
        <li class="" id="tab2" @click="choosePage(2)">历史考勤</li>
      </ul>
    </div>
    <!-- title-tab end -->
    <!--current page begin-->
    <div class="w card" v-show="currentPage === 1">
      <ul v-for="(value) in overViewClassMsg[0]">
        <li>
          <div class="classCard">
            <div class="cc-hd">{{ value.code }} 班</div>
            <div class="cc-bd" @click="showDetail()">
              <div class="block"><p>查看详情</p></div>
              <p>总人数： {{ 0-value.total }}</p>
              <p>实到人数： {{ value.attend }}</p>
              <p>缺勤人数： {{ (0-value.total)- value.attend }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!--current page end-->

    <!--history page begin-->
    <div class="w historyBox" v-show="currentPage === 2">
      <div class="hty-date">
        <div class="hty-hd">时间：{{year}}年{{month}}月{{day}}日</div>
        <div class="hty-bd" style="overflow: hidden;">
          <ul class="list-hd clearFix">
            <li><h4>序号</h4></li>
            <li><h4>课堂号</h4></li>
            <li><h4>学生总人数</h4></li>
            <li><h4>未签到人数</h4></li>
            <li><h4>备注</h4></li>
          </ul>
          <ul class="list-bd" v-for="(value, index) in overViewClassMsg[0]">
            <li>{{ index + 1 }}</li>
            <li>{{ value.code }}</li>
            <li>{{ 0-value.total }}</li>
            <li class="noSign-num">{{ (0-value.total)- value.attend }}</li>
            <li>
              <a @click="showDetail(index)">详情</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--history page end-->

    <div class="classroom">
      <!--详情弹框-->
      <transition name="detail">
        <div class="alert-detail" v-if="ifShow">
          <!--背景-->
          <div class="alert-detail-bg" @click="close"></div>
          <!--弹框内容-->
          <div class="alert-detail-wrap">
            <div class="alert-detail-header">
              <span class="detail-header-title">缺勤学生名单</span>
              <span>（{{ classMsg[param].class_id }}班）</span>
              <span>{{ classMsg[param].noSign }}人</span>
              <span @click="close" class="alert-detail-del"></span>
            </div>
            <div class="alert-detail-content">
              <div class="detail-content-header">
                <span>学号</span>
                <span>旷课</span>
                <span>旷课次数</span>
                <span>缺勤次数&nbsp;/&nbsp;总次数</span>
              </div>
              <div class="detail-content-body">
                <div class="content" v-for="(value) in students">
                  <span style="font-weight: bold;">{{ value.id }}</span>
                  <span><img src="../png/check.png" alt="" v-show="true"></span>
                  <span>{{ text }}</span>
                  <span>{{ text }}&nbsp;/&nbsp;{{ text }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>


  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {getStatus,getCheckin} from "../axios/api";
  // import index from "../router";

  export default {
    name: 'data_manage',
    data() {
      return {
        param: 0,
        class: '',

        currentPage: 1,
        // 详情弹框
        ifShow: false,
        // 开关变量
        count: 0,
        text: '—',

        classMsg: [],
        students: [{id: "12"}, {id: "13"}, {id: "14"},],
        overViewClassMsg: [],
        overViewStuMsg: [],
        viewClassMsg: [],

        // 未考勤学生信息
        noAttendedMsg: [],

        year: '',
        month: '',
        day: '',
      }
    },

    computed: {
      ...mapState([
        'Class_lists',
        'attended'
      ])
    },

    created() {
      //打开拉去考勤状态
      this.getStatusTo();
      // 获取用户创建的考勤
      this.getUserCheckin();
      if (this.Class_lists.length === 0) {
        this.$store.commit('change', JSON.parse(localStorage.getItem('class_lists')));
      }
      this.classMsg = this.Class_lists;
    },
    mounted() {
      // 设置历史考勤时间
      this.setHistoryAttendDate();

    },
    methods: {
      // 根据id获取元素
      getById(id) {
        return document.getElementById(id);
      },
      // 选择界面
      choosePage(index) {
        switch (index) {
          case 1:
            this.getById("tab1").className = "selected";
            this.getById("tab2").className = "";
            this.currentPage = 1;
            break;
          case 2:
            this.getById("tab1").className = "";
            this.getById("tab2").className = "selected";
            this.currentPage = 2;
            break;
        }
      },

      // 设置未出席人名单
      // setNoAttendedMsg() {
      //   console.log("已考勤", this.overViewClassMsg[0][0]);
      //   console.log("学生考勤状态",this.attended);
      //   // 出席人员名单
      //   var attendedObj = this.attended;
      //   var that = this;
      //   var count = 0;
      //   // var noAttendedStu = [];
      //   console.log(that.overViewClassMsg[0][0].total);
      //   // 遍历出席人员
      //   for (var index in attendedObj) {
      //     // 创建班级递增变量
      //     let j = 0;
      //     // 循环班级人数
      //     for (let i = 0; i < 0 - that.overViewClassMsg[0][j].total; i++) {
      //       // 创建临时数组-存放未考勤学生
      //       var noAttendedStu = [];
      //       // 如果有未考勤的人，放入临时数组
      //       if (attendedObj[index] !== i) {
      //         noAttendedStu[count++] = i;
      //       }
      //     }
      //     // 一个班级结束，递增换下一个班级
      //     j++;
      //   }
      //   // console.log(noAttendedStu);
      //   // for (var index in attendedObj){
      //   //   // 值
      //   //   // console.log(attendedObj[index]);
      //   //   // 键
      //   //   // console.log(index);
      //   //   attendedArr.push({class_id: index , attendedStu:attendedObj[index]});
      //   //   // this.noAttendedMsg[count++].push({class_id: index, noAttendedStu: });
      //   // }
      //   // console.log(attendedArr);
      // },
      // 设置历史考勤时间
      setHistoryAttendDate() {
        var myDate = new Date();
        console.log(myDate.toLocaleDateString());
        this.year = myDate.getFullYear();
        this.month = myDate.getMonth() + 1;
        this.day = myDate.getDate();
        console.log(this.year, this.month, this.day)
      },
      showDetail() {
        // this.class = index;
        // console.log('index', index)
        // if (this.count === 0) {
        //   console.log(this.count);
        //   this.count = 1;
        //   this.param = index;
        //   for (var i = 0; i < this.classMsg[index].students.length; i++) {
        //
        //     // console.log(this.classMsg[index].students[i].isSign);
        //     if (this.classMsg[index].students[i].isSign === false) {
        //       // console.log(this.classMsg[index].students[i]);
        //       this.students.push(this.classMsg[index].students[i]);
        //     }
        //   }
        //   // console.log(this.students);
        //   this.ifShow = !this.ifShow;
        //
        // } else {
        //   console.log(this.count);
        //   this.ifShow = !this.ifShow;
        // }
        this.ifShow = true;

      },

      //获取统计信息
      getStatusTo() {
        getStatus().then(result => {
          console.log('获取统计信息', result);
          this.overViewClassMsg = result.data.body;
          this.viewClassMsg = result.data.body;
          console.log("this.overViewClassMsg", this.overViewClassMsg);
          console.log("已考勤", this.overViewClassMsg);
          // console.log("student", this.students);
          this.makeStudentList()
          // 设置未出席人名单
          this.setNoAttendedMsg();
        }).catch(error => {
          console.log(error)
        });
      },

      getUserCheckin(){
        getCheckin().then(res=>{
          console.log(res)
        }).catch(err=>{
          console.log(err)
        })
      },
      //遍历学生
      makeStudentList() {
        let a = [];
        for (let i = 0; i < this.overViewClassMsg.length; i++) {
          a[i] = [];
          this.overViewStuMsg = a[i];
          for (let c = 0; c < this.overViewClassMsg[i].length; c++) {
            a[i][c] = [];
            for (let b = 0; b < (0 - this.overViewClassMsg[i][c].total); b++) {
              a[i][c].push({id: b, isSign: true, Late: false});
            }
          }
        }
        console.log('this.overViewStuMsg', this.overViewStuMsg);
      },

      close() {
        this.ifShow = !this.ifShow;
      }
    },
  }
</script>

<style scoped>
  @import "../css/base.css";

  /*title-tab begin*/
  .title-tab {
    margin-top: 30px;
    margin-bottom: 30px;
    overflow: hidden;
    border-bottom: 1px solid #e0e1e2;
  }

  .title-tab ul li {
    float: left;
    padding: 5px 0;
    margin: 0 10px;
    cursor: pointer;
    margin-bottom: -1px;
  }

  .title-tab ul li:hover {
    color: #1aad19;
  }

  .title-tab .selected {
    color: #1aad19;
    border-bottom: 2px solid #1aad19;
  }

  /*title-tab end*/

  /*current page begin*/
  .card ul li {
    float: left;
    width: 200px;
    background-color: #fff;
    margin-right: 20px;
    box-shadow: 0 1px 20px 0 #E4E8EB;
    border-radius: 2px;
    text-align: center;
  }

  .cc-hd {
    height: 40px;
    line-height: 40px;
    margin-bottom: 20px;
  }

  .cc-bd {
    height: 150px;
    cursor: default;
    position: relative;
  }

  .block {
    display: none;
    background-color: rgba(0, 0, 0, 0.5);
    height: 115%;
    width: 100%;
    position: absolute;
    top: -15%;
  }

  .block p {
    position: absolute;
    height: 20px;
    width: 100px;
    top: 50%;
    left: 50%;
    margin-left: -50px;
    margin-top: -10px;
    color: #fff;
    cursor: default;
  }

  .cc-bd:hover .block {
    display: block;
  }

  .cc-bd p {
    height: 40px;
  }

  /*current page end*/
  /*history page begin*/
  .historyBox {
    height: 550px;
    padding-top: 50px;
    background-color: #fff;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
  }

  .historyBox .hty-date {
    width: 90%;
    margin: 0 auto;
    border: 1px solid #e7e7eb;
  }

  .hty-hd {
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
    font-size: 12px;
    background-color: #f4f5f9;
  }

  .hty-bd li {
    text-align: center;
    width: 20%;
    float: left;
    font-size: 12px;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #e7e7eb;
    margin-top: -1px;
  }

  .list-bd li a {
    color: #2b2cff;
  }

  .list-bd li a:hover {
    text-decoration: underline;
  }

  /*history page end*/

  /*详情弹框-begin*/
  .alert-detail {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }

  .alert-detail-bg {
    width: 100%;
    height: 100%;
    background: #000;
    filter: alpha(opacity=50);
    opacity: .5;
  }

  .alert-detail-wrap {
    position: absolute;
    max-width: 800px;
    height: 600px;
    left: 50%;
    top: 10%;
    margin-left: -400px;
    background: #fff;
    border-radius: 2px;
    -webkit-animation: alert .3s;
    animation: alert .3s;
    width: 100%;
  }

  .alert-detail-header {
    margin-top: 10px;
    margin-left: 15px;
    line-height: 30px;
  }

  .alert-detail-del {
    cursor: pointer;
    width: 40px;
    height: 40px;
    background: url(../png/tiny-delete.png) no-repeat center center;
    display: block;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 101;
    /*background-color: #aaa;*/
  }

  .detail-header-title {
    color: #1aad19;
    font-size: 18px;
  }

  .alert-detail-content {
    position: absolute;
    top: 40px;
    left: 10px;
    right: 10px;
    bottom: 20px;
  }

  .detail-content-header {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    line-height: 32px;
    height: 32px;
    background-color: #e7e7eb;
    font-size: 14px;
  }

  .alert-detail-content span {
    display: inline-block;
    width: 24%;
    text-align: center;
  }

  .alert-detail-content .detail-content-body {
    position: absolute;
    top: 30px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: scroll;
  }

  .alert-detail-content .detail-content-body .content {
    line-height: 45px;
    height: 45px;
    /*line-height: 45px;*/
    border-bottom: #99C8EC solid 1px;
    font-size: 15px;
  }

  .detail-content-body .content img {
    display: inline-block;
    height: 16px;
    width: 16px;
  }

  .detail-content-body::-webkit-scrollbar {
    display: none;
  }

  /*详情弹框-end*/

  /*webkit内核*/
  .scroll_content::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .scroll_content::-webkit-scrollbar-button {
    background-color: rgba(0, 0, 0, 0);
  }

  .scroll_content::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0);
  }

  .scroll_content::-webkit-scrollbar-track-piece {
    background-color: rgba(0, 0, 0, 0);
  }

  .scroll_content::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0);
  }

  .scroll_content::-webkit-scrollbar-corner {
    background-color: rgba(0, 0, 0, 0);
  }

  .scroll_content::-webkit-scrollbar-resizer {
    background-color: rgba(0, 0, 0, 0);
  }

  .scroll_content::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  /*o内核*/
  .scroll_content .-o-scrollbar {
    -moz-appearance: none !important;
    background: rgba(0, 255, 0, 0) !important;
  }

  .scroll_content::-o-scrollbar-button {
    background-color: rgba(0, 0, 0, 0);
  }

  .scroll_content::-o-scrollbar-track {
    background-color: rgba(0, 0, 0, 0);
  }

  .scroll_content::-o-scrollbar-track-piece {
    background-color: rgba(0, 0, 0, 0);
  }

  .scroll_content::-o-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0);
  }

  .scroll_content::-o-scrollbar-corner {
    background-color: rgba(0, 0, 0, 0);
  }

  .scroll_content::-o-scrollbar-resizer {
    background-color: rgba(0, 0, 0, 0);
  }

  /*IE10,IE11,IE12*/
  .scroll_content {
    -ms-scroll-chaining: chained;
    -ms-overflow-style: none;
    -ms-content-zooming: zoom;
    -ms-scroll-rails: none;
    -ms-content-zoom-limit-min: 100%;
    -ms-content-zoom-limit-max: 500%;
    -ms-scroll-snap-type: proximity;
    -ms-scroll-snap-points-x: snapList(100%, 200%, 300%, 400%, 500%);
    -ms-overflow-style: none;
    overflow: auto;
  }

</style>
