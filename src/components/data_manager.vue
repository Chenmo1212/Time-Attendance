<template>
  <div id="data_manage">
    <div class="classroom">

      <div class="table">
        <div class="table_header" style="font-weight: bold;">
          <span>序号</span>
          <span>课堂号</span>
          <span>学生总人数</span>
          <span>未签到人数</span>
          <span>备注</span>
        </div>
        <div class="table_body">
          <div class="item" v-for="(value, index) in classMsg">
            <span>{{ index + 1 }}</span>
            <span>{{ value.class_id }}</span>
            <span>{{ value.total }}</span>
            <span style="color: red">{{ value.noSign }}</span>
            <span><button @click="showDetail(index)">详情</button></span>
          </div>
        </div>
      </div>


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
                <span>迟到</span>
                <span>旷课</span>
                <span>迟到次数</span>
                <span>旷课次数</span>
                <span>缺勤次数&nbsp;/&nbsp;总次数</span>

              </div>
              <div class="detail-content-body">
                <div class="content" v-for="(value, index) in students">
                  <span style="font-weight: bold;">{{ value.id }}</span>
                  <span><img src="../png/check.png" alt="" v-show="value.Late"></span>
                  <span><img src="../png/check.png" alt="" v-show="value.Truancy"></span>
                  <span>{{ text }}</span>
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
  import { mapState } from 'vuex'

  export default {
    name: 'data_manage',
    data() {
      return {
        param: 0,

        // 详情弹框
        ifShow: false,
        // 开关变量
        count: 0,
        text: '-',

        classMsg: [],
        students: [],

      }
    },

    computed: {
      ...mapState([
        'Class_lists'
      ])
    },

    created(){
      // 跟classMsg一毛一样，就不再解释了
      if(this.Class_lists.length === 0){
        this.$store.commit('change', JSON.parse(localStorage.getItem('class_lists')));
      }
      this.classMsg = this.Class_lists;
    },


    methods: {
      showDetail(index){
        if (this.count === 0) {
          console.log(this.count);
          this.count = 1;
          this.param = index;
          for(var i = 0; i < this.classMsg[index].students.length; i++){
            if(this.classMsg[index].students[i].isSign === false){
              this.students.push(this.classMsg[index].students[i]);
            }
          }
          this.ifShow = ! this.ifShow;

        } else {
          console.log(this.count);
          this.ifShow = ! this.ifShow;
        }

      },
      close(){
        this.ifShow = ! this.ifShow;
      }
    },
  }
</script>

<style scoped>
  .classroom{
    height: 100%;
    width: 100%;
    padding: 30px 20px;
    /*overflow-y: scroll;*/
    box-sizing: border-box;
  }

  .classroom .table .table_header {
    /*padding: 10px;*/
    height: 40px;
    width: 100%;
    line-height: 40px;
    border: #e7e7eb solid 1px;
    background-color: #e7e7eb;
  }

  .table  span {
    display: inline-block;
    width: 19%;
    text-align: center;
    font-size: 14px;
    /*outline: none;*/
  }

  .table .table_body {}

  .table_body .item {
    display: block;
    border-bottom: #e7e7eb solid 1px;
    height: 40px;
    line-height: 40px;
  }

  .table_body .item button {
    border: none;
    background: none;
    outline: none;
    color: #2b2cff;
    cursor: pointer;
  }

  .table_body .item button:active {
    color: #ff3e23;
  }

  .table_body .item button:hover {
    text-decoration: underline;
  }

  /*详情弹框-begin*/
  .alert-detail {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 100;
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

  .alert-detail-content  span {
    display: inline-block;
    width: 16%;
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
    border-bottom: #99C8EC solid 1px ;
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

  .detail-enter-active {
    transition: all 0.3s ease;
  }

  .detail-enter {
    /* .slide-fade-leave-active for below version 2.1.8 */
    transform: translateY(7px);
    opacity: 0;
  }

  .detail-leave-active {
    transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .detail-leave-to {
    opacity: 0;
  }

  /*webkit内核*/
  .scroll_content::-webkit-scrollbar {
    width:0px;
    height:0px;
  }
  .scroll_content::-webkit-scrollbar-button    {
    background-color:rgba(0,0,0,0);
  }
  .scroll_content::-webkit-scrollbar-track     {
    background-color:rgba(0,0,0,0);
  }
  .scroll_content::-webkit-scrollbar-track-piece {
    background-color:rgba(0,0,0,0);
  }
  .scroll_content::-webkit-scrollbar-thumb{
    background-color:rgba(0,0,0,0);
  }
  .scroll_content::-webkit-scrollbar-corner {
    background-color:rgba(0,0,0,0);
  }
  .scroll_content::-webkit-scrollbar-resizer  {
    background-color:rgba(0,0,0,0);
  }
  .scroll_content::-webkit-scrollbar {
    width:10px;
    height:10px;
  }
  /*o内核*/
  .scroll_content .-o-scrollbar{
    -moz-appearance: none !important;
    background: rgba(0,255,0,0) !important;
  }
  .scroll_content::-o-scrollbar-button    {
    background-color:rgba(0,0,0,0);
  }
  .scroll_content::-o-scrollbar-track     {
    background-color:rgba(0,0,0,0);
  }
  .scroll_content::-o-scrollbar-track-piece {
    background-color:rgba(0,0,0,0);
  }
  .scroll_content::-o-scrollbar-thumb{
    background-color:rgba(0,0,0,0);
  }
  .scroll_content::-o-scrollbar-corner {
    background-color:rgba(0,0,0,0);
  }
  .scroll_content::-o-scrollbar-resizer  {
    background-color:rgba(0,0,0,0);
  }
  /*IE10,IE11,IE12*/
  .scroll_content{
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
